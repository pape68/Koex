import { REST } from '@discordjs/rest';
import { ChatInputApplicationCommandData, Routes } from 'discord.js';

import { ExtendedClient } from '../interfaces/ExtendedClient';

const registerCommands = async (
    client: ExtendedClient,
    commands: ChatInputApplicationCommandData[]
) => {
    if (!client.isReady()) return;

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        await rest.put(Routes.applicationCommands(client.user!.id), {
            body: commands
        });

        client.logger.info('Loaded application (/) commands.');
    } catch (err) {
        client.logger.error(err);
    }
};

export default registerCommands;
