import { ActivityType } from 'discord.js';
import pc from 'picocolors';

import { Event } from '../interfaces/Event';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import loadCommands from '../utils/handlers/loadCommands';
import loadComponents from '../utils/handlers/loadComponents';

export const event: Event<true> = {
    name: 'ready',
    execute: async (client: ExtendedClient) => {
        console.info(
            `Logged in as ${
                pc.bold(client.user!.username) + pc.gray('#' + client.user!.discriminator)
            }. ✅`
        );
        loadCommands(client);
        loadComponents(client);

        const userCount = client.users.cache.size;

        client.user!.setActivity(`${userCount} Members`, { type: ActivityType.Watching });
    }
};

export default event;
