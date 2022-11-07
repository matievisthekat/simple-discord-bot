import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';

export default {
	slash: new SlashCommandBuilder()
		.setName('createticket')
		.setDescription('Create a ticket so the support staff can help you!'),
  async execute(int: ChatInputCommandInteraction) {
    int.deferReply({ephemeral: true});

    const tickets = int.client.sql.models.tickets;

    const alreadyCreated = await tickets.findOne({
      where: {
        user_id: int.user.id,
        guild_id: int.guild?.id
      }
    });

    if (alreadyCreated) {
      await int.editReply({content: `You already have a ticket! Check <#${alreadyCreated.get('channel_id')}>`})
      return;
    }
  }
};
