import { sync } from 'glob';
import { join } from 'path';

import { Command } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import registerCommands from './registerCommands';

const loadCommands = (client: ExtendedClient) => {
    const commands: Command[] = [];
    const files = sync('src/commands/**/*.ts');

    for (const file of files) {
        const path = join(process.cwd(), file);
        const interaction: Command = require(path).default;

        client.interactions.set(interaction.name, interaction);

        commands.push(interaction);
    }

    registerCommands(client, commands);
};

export default loadCommands;
