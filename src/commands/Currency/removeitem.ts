import {ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandRoleOption} from 'discord.js';
import ShopItems from '../../models/shopitems';

export default {
	slash: new SlashCommandBuilder()
		.setName('removeitem')
		.setDescription('Remove an item from the shop')
		.addRoleOption(
			new SlashCommandRoleOption()
				.setName('role')
				.setDescription('THe role you want to remove from the shop')
				.setRequired(true)
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
			await int.reply({content: 'That role is not in the shop'});
			return;
		}

		await item.destroy();

		await int.reply({content: 'I have removed that role from the shop'});
	}
};
