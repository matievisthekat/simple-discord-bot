import {config} from 'dotenv';
config();

import {Client, ClientOptions, Collection, Events, GatewayIntentBits} from 'discord.js';
import {Command, findCommands} from './commandHandler';

class SimpleBot extends Client {
	commands: Collection<string, Command> = new Collection();

	constructor(options: ClientOptions) {
		super(options);
	}

	async populateCommands() {
		const modules = await findCommands('/');
		modules.forEach((mod) => this.commands.set(mod.slash.name, mod));
		return this.commands;
	}
}

const client = new SimpleBot({intents: [GatewayIntentBits.Guilds]});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({
			content: `There was an error executing that command. See below:\n\`\`\`${err}\`\`\``
		});
	}
});
