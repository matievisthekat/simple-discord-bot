import {
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandUserOption
} from 'discord.js';
import Warnings from '../../models/warnings';

export default {
	slash: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('View the warnings of a user')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user you want to view the warnings of')
				.setRequired(false)
		),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		await int.deferReply();

		const target = int.options.getUser('user', false) ?? int.user;

		const warns = await Warnings.findAll({
			where: {
				user_id: target.id
			}
		});

		if (warns.length === 0) {
			await int.editReply(`${target.id === int.user.id ? "You don't" : `${target} doesn't`} have any warnings`);
			return;
		}

		const embed = new EmbedBuilder()
			.setColor(Colors.Orange)
			.setAuthor({
				name: target.tag,
				iconURL: target.avatarURL() ?? undefined
			})
			.addFields(
				warns.map((w, i) => {
					return {
						name: `Warn #${w.id}`,
						value: `${w.reason}\nby <@${w.moderator_id}>`
					};
				})
			);

		await int.editReply({embeds: [embed]});
	}
};
