import {ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandRoleOption} from 'discord.js';
import {isMapIterator} from 'util/types';
import Bank from '../../models/bank';
import ShopItems from '../../models/shopitems';

export default {
	slash: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy a role from the shop')
		.addRoleOption(
			new SlashCommandRoleOption().setName('role').setDescription('The role you want to buy').setRequired(true)
		),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		const role = int.options.getRole('role', true);

		const item = await ShopItems.findOne({
			where: {
				guild_id: int.guild.id,
				role_id: role.id
			}
		});

		if (!item) {
			await int.reply({content: 'That role is not for sale'});
			return;
		}

		const bal = await Bank.findOne({
			where: {
				user_id: int.user.id
			}
		});

		if (!bal || item.price > bal.balance) {
			await int.reply({
				content: `You don't have enough money! you need ${(item.price - (bal?.balance || 0)).toFixed(2)}:cherries:`
			});
			return;
		}

		await int.deferReply();

		const member = await int.guild.members.fetch(int.user.id);
		await member.roles.add(item.role_id);
		await bal.decrement('balance', {by: item.price});

		await int.editReply({content: `You have bought **${role.name}** for ${item.price.toFixed(2)}:cherries:`});
	}
};
