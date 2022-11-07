import {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandBuilder,
} from 'discord.js';
import {Settings} from '../../types/settings';

export default {
	slash: new SlashCommandBuilder()
		.setName('viewticketcategory')
		.setDescription('View the current category that ticket channels will appear under')
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),
	async execute(int: ChatInputCommandInteraction) {
    await int.deferReply();

		const setting = await int.client.sql.models.settings.findOne({
			where: {name: Settings.TicketCategory, guild_id: int.guild?.id}
		});
    const chan = int.guild?.channels.cache.get(setting?.get('value') as string);
    
		if (!setting || !chan) {
      await int.editReply({content: "It seems like you don't have a ticket category set"});
      return;
    }

    await int.editReply({content: `Your ticket category is \`${chan.name}\``});
	}
};
