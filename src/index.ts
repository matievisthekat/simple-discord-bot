import {config} from 'dotenv';
config();

import {Client, ClientOptions, Collection, Events, GatewayIntentBits} from 'discord.js';
import {Sequelize, DataTypes} from 'sequelize';
import {Command, findCommands} from './commandHandler';
import Tickets from './models/tickets';
import Settings from './models/settings';
import {createTicket, ticketReasons} from './util/tickets';
import {TicketReason} from './types/tickets';
import Warnings from './models/warnings';
import Bank from './models/bank';
import ShopItems from './models/shopitems';

class SimpleBot extends Client {
	commands: Collection<string, Command> = new Collection();
	sql = new Sequelize({
		dialect: 'sqlite',
		storage: 'database.sqlite',
		logging: console.log
	});

	constructor(options: ClientOptions) {
		super(options);
	}

	async populateCommands() {
		const modules = await findCommands('/');
		modules.forEach((mod) => this.commands.set(mod.slash.name, mod));
		return this.commands;
	}

	async syncModels() {
		Tickets.init(
			{
				user_id: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true
				},
				channel_id: {
					type: DataTypes.STRING,
					allowNull: false
				},
				guild_id: {
					type: DataTypes.STRING,
					allowNull: false
				}
			},
			{
				tableName: 'tickets',
				sequelize: this.sql
			}
		);

		Settings.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true
				},
				value: {
					type: DataTypes.STRING,
					allowNull: true
				},
				guild_id: {
					type: DataTypes.STRING,
					allowNull: false
				}
			},
			{
				tableName: 'settings',
				sequelize: this.sql
			}
		);

		Warnings.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
					unique: true,
					allowNull: false
				},
				user_id: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: false
				},
				moderator_id: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: false
				},
				reason: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: false
				}
			},
			{
				tableName: 'warnings',
				sequelize: this.sql
			}
		);

		Bank.init(
			{
				user_id: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true
				},
				balance: {
					type: DataTypes.FLOAT,
					allowNull: false,
					defaultValue: 0
				}
			},
			{
				tableName: 'bank',
				sequelize: this.sql
			}
		);

		ShopItems.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
					unique: true,
					allowNull: false
				},
				guild_id: {
					type: DataTypes.STRING,
					allowNull: false
				},
				role_id: {
					type: DataTypes.STRING,
					allowNull: false
				},
				price: {
					type: DataTypes.FLOAT,
					allowNull: false
				}
			},
			{
				tableName: 'shop_items',
				sequelize: this.sql
			}
		);

		await this.sql.sync();
	}
}

const client = new SimpleBot({intents: [GatewayIntentBits.Guilds]});

client.on(Events.ClientReady, (c) => {
	console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.guild) return;

	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			const msg = {
				content: `There was an error executing that command. See below:\n\`\`\`${err}\`\`\``
			};
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply(msg);
			} else {
				await interaction.reply(msg);
			}
		}
	} else if (interaction.isButton()) {
		if (interaction.customId.startsWith('open-ticket')) {
			await interaction.deferReply({ephemeral: true});
			const alreadyOpen = await Tickets.findOne({
				where: {user_id: interaction.user.id, guild_id: interaction.guild.id}
			});

			if (alreadyOpen) {
				await interaction.editReply({content: `You already have a ticket open: <#${alreadyOpen.channel_id}>`});
				return;
			}

			createTicket(interaction.user, interaction.guild, interaction)
				.then(async (channel) => {
					const reason = ticketReasons[(interaction.customId.split('-').pop() as TicketReason) || 'support'];
					await channel.setTopic(reason);
					await channel.send({
						content: `${interaction.user} opened this ticket because they are: \`${reason}\``
					});
					await interaction.editReply({content: `Your ticket has been openened: ${channel}`});
				})
				.catch(async () => {
					await interaction.editReply({content: 'Failed to create ticket'});
				});
		}
	}
});

client.sql.authenticate().then(async () => {
	await client.syncModels();
	await client.populateCommands();

	await client.login(process.env.TOKEN);
});
