import * as discord from 'discord.js';
import { Command } from './commandHandler';

declare module 'discord.js' {
  interface Client {
    commands: discord.Collection<string, Command>;
    sql: Sequelize;
    tickets: ModelCtor<Model<any, any>>;
    settings: ModelCtor<Model<any, any>>;
  }
}