import {ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from 'discord.js';
import Settings from '../../models/settings';
import {SettingsNames} from '../../types/settings';

export default {
	slash: new SlashCommandBuilder()
		.setName('viewticketcategory')
		.setDescription('View the current category that ticket channels will appear under')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
		.setDMPermission(false),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;
		await int.deferReply();

		const setting = await Settings.findOne({
			where: {name: SettingsNames.TicketCategory, guild_id: int.guild.id}
		});
		const chan = int.guild?.channels.cache.get(setting?.value as string);

		if (!setting || !chan) {
			await int.editReply({content: "It seems like you don't have a ticket category set"});
			return;
		}

		await int.editReply({content: `Your ticket category is \`${chan.name}\``});
	}
};
