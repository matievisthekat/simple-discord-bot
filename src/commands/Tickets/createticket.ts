import {ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from 'discord.js';
import Settings from '../../models/settings';
import Tickets from '../../models/tickets';
import {SettingsNames} from '../../types/settings';

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

		const category = await Settings.findOne({
			where: {
				name: SettingsNames.TicketCategory,
				guild_id: int.guild.id
			}
		});

		const channel = await int.guild?.channels.create({
			name: `ticket-${int.user.username}`,
			reason: `${int.user.tag} (${int.user.id}) created a ticket`,
			type: ChannelType.GuildText
		});

		if (!channel) {
			await int.editReply({content: 'Failed to create channel'});
			return;
		}

		await Tickets.create({
			user_id: int.user.id,
			channel_id: channel.id,
			guild_id: int.guild.id
		});

		if (category) {
			await channel.setParent(category.value as string);
		}

		await channel.permissionOverwrites.set([
			{
				id: int.guild.id,
				deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
			},
			{
				id: int.user.id,
				allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
			},
			{
				id: int.client.user.id,
				allow: [
					PermissionFlagsBits.ManageChannels,
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.SendMessages
				]
			}
		]);

		await channel.send({content: `${int.member} has opened a ticket!`});
		await int.editReply({content: `Your ticket has been opened in ${channel}`});
	}
};
