import { join } from 'node:path';

import glob from 'glob';

import { IS_PROD } from '../../constants';
import { Command } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import registerInteractions from './registerInteractions';

const loadCommands = async (client: ExtendedClient) => {
    const commands: Command[] = [];

    const files = glob.sync(`${IS_PROD ? 'dist' : 'src'}/commands/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const interaction: Command = (await import(path)).default;

        if (!interaction) continue;

        client.interactions.set(interaction.name, interaction);

        commands.push(interaction);
    }

    registerInteractions(client, commands);
};

export default loadCommands;
