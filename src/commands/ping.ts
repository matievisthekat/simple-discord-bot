import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';

export default {
	slash: new SlashCommandBuilder().setName('ping').setDescription('Ping pong'),
	async execute(int: ChatInputCommandInteraction) {
		await int.reply({content: 'Pong!'});
	}
};
