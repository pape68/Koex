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

        await loadCommands(client);
        await loadComponents(client);

        const getUsers = () =>
            client.guilds.cache.map((g) => g.memberCount).reduce((a, c) => a + c);

        setInterval(() => {
            const userCount = getUsers();
            client.user!.setActivity(`${userCount} Users`, {
                type: ActivityType.Watching
            });
        }, 10 * 1000);
    }
};

export default event;
