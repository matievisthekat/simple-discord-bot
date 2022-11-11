import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import Bank from '../../models/bank';

export default {
	slash: new SlashCommandBuilder().setName('work').setDescription('Work for money'),
	async execute(int: ChatInputCommandInteraction) {
		const amt = Number((Math.random() * 100).toFixed(2));

		const [bank] = await Bank.findOrCreate({
			where: {
				user_id: int.user.id
			},
			defaults: {
				user_id: int.user.id,
				balance: 0.0
			}
		});

		await bank.increment('balance', {by: amt});

		await int.reply({content: `You worked and earned \`$${amt.toFixed(2)}\``});
	}
};
