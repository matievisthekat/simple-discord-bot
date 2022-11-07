import * as discord from 'discord.js';
import {Sequelize} from 'sequelize';
import {Command} from '../commandHandler';

declare module 'discord.js' {
	interface Client {
		commands: discord.Collection<string, Command>;
		sql: Sequelize;
	}
}
