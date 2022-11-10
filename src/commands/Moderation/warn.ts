import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	PermissionsBitField,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandUserOption
} from 'discord.js';
import Warnings from '../../models/warnings';

export default {
	slash: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Give a user a warning')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user that you want to warn')
				.setRequired(true)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName('reason')
				.setDescription('The reason you are warning them')
				.setRequired(true)
		),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		await int.deferReply();

		const user = int.options.getUser('user', true);
		const reason = int.options.getString('reason', true);

		await Warnings.create({
			user_id: user.id,
			moderator_id: int.user.id,
			reason
		});

		await user
			.send({content: `You have been warned in ${int.guild.name} with the reason: **${reason}**`})
			.catch(() => {});

		await int.editReply({content: `${user} has been warned with the reason: **${reason}**`});
	}
};
