import {
	ChannelType,
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandBuilder,
	SlashCommandStringOption
} from 'discord.js';
import Settings from '../../models/settings';
import {SettingsNames} from '../../types/settings';

export default {
	slash: new SlashCommandBuilder()
		.setName('setticketcategory')
		.addStringOption(
			new SlashCommandStringOption()
				.setName('category')
				.setMaxLength(255)
				.setDescription('The name of the category')
				.setRequired(true)
		)
		.setDescription('Set the category for ticket channels to appear under')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
		.setDMPermission(false),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		const name = int.options.getString('category');
		const chan = int.guild.channels.cache.find(
			(c) => c.name.toLowerCase() === name?.toLowerCase() && c.type === ChannelType.GuildCategory
		);

		await int.deferReply();
		if (!chan) {
			await int.editReply({content: `There isn't a category with the name \`${name}\``});
			return;
		}


		const alreadyExists = await Settings.findOne({
			where: {name: SettingsNames.TicketCategory, guild_id: int.guild.id}
		});

		if (alreadyExists) {
			await Settings.update(
				{value: chan.id},
				{where: {name: SettingsNames.TicketCategory, guild_id: int.guild.id}}
			);
		} else {
			await Settings.create({
				name: SettingsNames.TicketCategory,
				value: chan.id,
				guild_id: int.guild.id
			});
		}

		await int.editReply({content: `Updated your ticket category to \`${chan.name}\``});
	}
};
