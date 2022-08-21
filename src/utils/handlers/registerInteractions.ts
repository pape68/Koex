import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { Command } from '../../interfaces/Command';

import { ExtendedClient } from '../../interfaces/ExtendedClient';

const registerInteractions = async (client: ExtendedClient, commands: Command[]) => {
    if (!client.isReady()) return;

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        await rest.put(Routes.applicationCommands(client.user!.id), {
            body: commands
        });

        console.info('Registered interactions. ✅');
    } catch (err) {
        console.error(err);
    }
};

export default registerInteractions;
