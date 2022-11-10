import {ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from 'discord.js';
import Settings from '../../models/settings';
import Tickets from '../../models/tickets';
import {SettingsNames} from '../../types/settings';
import {createTicket} from '../../util/tickets';

export default {
	slash: new SlashCommandBuilder()
		.setName('createticket')
		.setDescription('Create a ticket so the support staff can help you!')
		.setDMPermission(false),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		await int.deferReply({ephemeral: true});

		const alreadyCreated = await Tickets.findOne({
			where: {
				user_id: int.user.id,
				guild_id: int.guild.id
			}
		});

		if (alreadyCreated) {
			await int.editReply({content: `You already have a ticket! Check <#${alreadyCreated.get('channel_id')}>`});
			return;
		}

		createTicket(int.user, int.guild, int)
			.then(async (channel) => {
				await channel.send({content: `${int.user} has opened a ticket!`});
				await int.editReply({content: `Your ticket has been opened in ${channel}`});
			})
			.catch(async () => {
				await int.editReply({content: 'Failed to create ticket'});
			});
	}
};
