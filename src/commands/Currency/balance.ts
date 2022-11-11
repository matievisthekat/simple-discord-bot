import {ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption} from 'discord.js';
import Bank from '../../models/bank';

export default {
	slash: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check your own balance, or the balance of another user')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user you want to check the balance of')
				.setRequired(false)
		),
	async execute(int: ChatInputCommandInteraction) {
		const target = int.options.getUser('user', false) || int.user;

		const bank = await Bank.findOne({
			where: {
				user_id: target.id
			}
		});
		const bal = bank?.balance?.toFixed(2) ?? (0.00).toFixed(2);

    await int.reply({content: `${target === int.user ? `You have` : `${target} has`} \`$${bal}\` in the bank`})
	}
};
