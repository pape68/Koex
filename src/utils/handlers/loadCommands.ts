import { join } from 'node:path';

import glob from 'glob';

import { Command } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import { isProd } from './../../constants';
import registerInteractions from './registerInteractions';

const loadCommands = async (client: ExtendedClient) => {
    const commands: Command[] = [];

    const files = glob.sync(`${isProd ? 'dist' : 'src'}/commands/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const url = new URL('file:///' + path);
        const command: Command = (await import(url.href)).default;

        if (!command) continue;

        client.commands.set(command.name, command);
        commands.push(command);
    }

    await registerInteractions(client, commands);
};

export default loadCommands;
