import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandIntegerOption,
	SlashCommandRoleOption
} from 'discord.js';
import ShopItems from '../../models/shopitems';

export default {
	slash: new SlashCommandBuilder()
		.setName('additem')
		.setDescription('Add an item to the shop')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.addRoleOption(
			new SlashCommandRoleOption()
				.setName('role')
				.setDescription('The role you want to add to the shop')
				.setRequired(true)
		)
		.addIntegerOption(
			new SlashCommandIntegerOption()
				.setName('price')
				.setDescription('The price you want to sell the role for')
				.setRequired(true)
		),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		const role = int.options.getRole('role', true);
		const price = int.options.getInteger('price', true);

		await ShopItems.create({
			guild_id: int.guild.id,
			role_id: role.id,
			price
		});

		await int.reply({content: `I have added **${role.name}** to the shop for ${price.toFixed(2)}:cherries:`});
	}
};
