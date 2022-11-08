import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandUserOption
} from 'discord.js';
import Tickets from '../../models/tickets';

export default {
	slash: new SlashCommandBuilder()
		.setName('closeticket')
		.setDescription("Close your open ticket or (if you are an admin) close another person's ticket")
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The owner of the ticket you want to close')
				.setRequired(false)
		),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		await int.deferReply();

		const user = int.options.getUser('user', false);

		if (user && user.id !== int.user.id && !int.memberPermissions?.has(PermissionFlagsBits.ManageChannels)) {
			await int.editReply({content: "You don't have enough permissions to do that!"});
			return;
		}

		const ticket = await Tickets.findOne({
			where: {
				user_id: user ? user.id : int.user.id,
				guild_id: int.guild.id
			}
		});

		if (!ticket) {
			await int.editReply({
				content: `${user && user.id !== int.user.id ? "That user doesn't" : "You don't"} have an open ticket`
			});
			return;
		}

		const channel = int.guild.channels.cache.get(ticket.channel_id);
		if (channel) {
			await channel.delete().catch(() => {});
		}

    
    await ticket.destroy();
		await int.editReply({content: 'I have closed the ticket!'}).catch(() => {});
		if (user && user.id !== int.user.id) {
      await user.send({content: `${int.user} has closed your ticket in **${int.guild.name}**`}).catch(() => {});
		}
	}
};
