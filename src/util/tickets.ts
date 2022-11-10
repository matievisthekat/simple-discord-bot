import {ChannelType, Guild, Interaction, PermissionFlagsBits, TextChannel, User} from 'discord.js';
import Settings from '../models/settings';
import Tickets from '../models/tickets';
import {SettingsNames} from '../types/settings';

export const ticketReasons = {
	report: 'Reporting a user',
	claim: 'Claiming a reward',
	support: 'Requesting support',
	donation: 'Making a donation',
};

export async function createTicket(user: User, guild: Guild, int: Interaction): Promise<TextChannel> {
	return new Promise(async (resolve, reject) => {
		const category = await Settings.findOne({
			where: {
				name: SettingsNames.TicketCategory,
				guild_id: guild.id
			}
		});

		const channel = await guild.channels.create({
			name: `ticket-${user.username}`,
			reason: `${user.tag} (${user.id}) created a ticket`,
			type: ChannelType.GuildText
		});

		if (!channel) {
			reject();
			return;
		}

		await Tickets.create({
			user_id: user.id,
			channel_id: channel.id,
			guild_id: guild.id
		});

		if (category) {
			await channel.setParent(category.value as string);
		}

		await channel.permissionOverwrites.set([
			{
				id: guild.id,
				deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
			},
			{
				id: user.id,
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

		resolve(channel);
	});
}
