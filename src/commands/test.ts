import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';

export default {
	slash: new SlashCommandBuilder().setName('test').setDescription('Test this bot'),
	async execute(int: ChatInputCommandInteraction) {
		int.reply({content: 'Pong!'});
	}
};
