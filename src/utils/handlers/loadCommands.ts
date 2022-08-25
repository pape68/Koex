import { sync } from 'glob';
import { join } from 'path';

import { Command } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import registerInteractions from './registerInteractions';

const loadCommands = (client: ExtendedClient) => {
    const commands: Command[] = [];
    const isProd = process.env.NODE_ENV === 'production';

    const files = sync(`${isProd ? 'dist' : 'src'}/commands/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const interaction: Command = require(path).default;

        client.interactions.set(interaction.name, interaction);

        commands.push(interaction);
    }

    registerInteractions(client, commands);
};

export default loadCommands;
