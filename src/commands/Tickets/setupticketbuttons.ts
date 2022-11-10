import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	MessageActionRowComponentBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder
} from 'discord.js';

export default {
	slash: new SlashCommandBuilder()
		.setName('setupticketbuttons')
		.setDescription('Setup a message containing buttons to open different kinds of tickets')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		await int.deferReply();

		const embed = new EmbedBuilder()
			.setTitle('Tickets')
			.setDescription('Click on one of the buttons below to open a ticket!');
		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
			new ButtonBuilder().setCustomId('open-ticket-support').setLabel('Support').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('open-ticket-donation').setLabel('Donations').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('open-ticket-claim').setLabel('Claim Rewards').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('open-ticket-report').setLabel('Report User').setStyle(ButtonStyle.Primary)
		);
		await int.channel?.send({embeds: [embed], components: [row]});
		await int.editReply({content: 'Done!'});
	}
};
