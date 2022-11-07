import {config} from 'dotenv';
config();

import {Client, ClientOptions, Collection, Events, GatewayIntentBits} from 'discord.js';
import {Sequelize, DataTypes} from 'sequelize';
import {Command, findCommands} from './commandHandler';

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
		this.sql.define('tickets', {
			user_id: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			channel_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			guild_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		});

		this.sql.define('settings', {
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			value: {
				type: DataTypes.STRING,
				allowNull: true,
			}
		});

		await this.sql.sync();
	}
}


const client = new SimpleBot({intents: [GatewayIntentBits.Guilds]});

client.on(Events.ClientReady, (c) => {
	console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({
			content: `There was an error executing that command. See below:\n\`\`\`${err}\`\`\``
		});
	}
});

client.sql.authenticate().then(async () => {
	await client.syncModels();
	await client.populateCommands();

	await client.login(process.env.TOKEN);
});
