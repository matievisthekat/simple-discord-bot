import fs from 'fs';
import path from 'path';
import {Interaction, SlashCommandBuilder} from 'discord.js';

export interface Command {
	slash: SlashCommandBuilder;
	execute(int: Interaction): Promise<void>;
}

export async function findCommands(baseDir: string): Promise<Command[]> {
	const res: Command[] = [];

  const dirents = fs.readdirSync(path.join(__dirname, 'commands', baseDir), {withFileTypes: true});
  for (const dirent of dirents) {
    const direntPath = path.join(baseDir, dirent.name);

		if (dirent.isDirectory()) {
			res.push(... await findCommands(direntPath));
		} else if (dirent.isFile() && dirent.name.split('.').pop() === 'js') {
			const filePath = path.join(__dirname, 'commands', baseDir, dirent.name);

			const {default: mod} = await import(filePath)
      if ('slash' in mod && 'execute' in mod) {
        if (mod.slash instanceof SlashCommandBuilder && typeof mod.execute === 'function') {
          res.push(mod);
        }
      }
		}
  }

	return res;
}
