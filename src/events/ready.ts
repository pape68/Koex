import { ActivityType } from 'discord.js';
import cron from 'node-cron';
import pc from 'picocolors';

import { Event } from '../interfaces/Event';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import loadCommands from '../utils/handlers/loadCommands';
import loadComponents from '../utils/handlers/loadComponents';
import startAutoDailyJob from '../jobs/autoDaily';

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

        let i = 0;
        setInterval(() => {
            const userCount = getUsers();

            const activities = [`${userCount} Users`, `${client.guilds.cache.size} Servers`];

            const i = Math.floor(Math.random() * (activities.length - 1) + 1);
            const activity = activities[i];

            client.user!.setActivity(activity, {
                type: ActivityType.Watching
            });
        }, 10 * 1000);

        cron.schedule('1 0 * * *', async () => {
            await startAutoDailyJob(client);
        });
    }
};

export default event;
