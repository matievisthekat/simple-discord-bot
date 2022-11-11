import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from 'discord.js';
import ShopItems from '../../models/shopitems';

export default {
	slash: new SlashCommandBuilder().setName('shop').setDescription('View the items in the shop'),
	async execute(int: ChatInputCommandInteraction) {
		if (!int.guild) return;

		const items = await ShopItems.findAll({
			where: {
				guild_id: int.guild.id
			}
		});

		if (items.length === 0) {
			await int.reply({content: "This server doesn't have any items in their shop"});
			return;
		}

		const embed = new EmbedBuilder()
			.setAuthor({name: int.guild.name, iconURL: int.guild.iconURL() || undefined})
			.addFields(
				items.map((i) => {
					return {
						name: `#${i.id}`,
						value: `<@&${i.role_id}>: ${i.price.toFixed(2)}:cherries:`
					};
				})
			);

		await int.reply({embeds: [embed]});
	}
};
