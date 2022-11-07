import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';

export default {
	slash: new SlashCommandBuilder()
		.setName('createticket')
		.setDescription('Create a ticket so the support staff can help you!'),
  async execute(int: ChatInputCommandInteraction) {
    int.deferReply({ephemeral: true});

    const tickets = int.client.tickets;

    const alreadyCreated = tickets.find({
      where: {
        user_id: int.user.id,
        guild_id: int.guild?.id
      }
    });

    if (alreadyCreated) {
      await int.editReply({content: `You already have a ticket! Check <#${alreadyCreated.channel_id}>`})
      return;
    }
  }
};
