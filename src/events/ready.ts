import chalk from 'chalk';
import { ActivityType } from 'discord.js';
import cron from 'node-cron';

import { Event } from '../interfaces/Event';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import startAutoDailyJob from '../jobs/autoDaily';
import loadCommands from '../utils/handlers/loadCommands';
import loadComponents from '../utils/handlers/loadComponents';

export const event: Event<true> = {
    name: 'ready',
    execute: async (client: ExtendedClient) => {
        const { username, discriminator } = client.user!;

        console.info(`Logged in as ${chalk.bold(username) + chalk.bold(chalk.gray('#' + discriminator))}`);

        await loadCommands(client);
        await loadComponents(client);

        const getUsers = () => client.guilds.cache.map((g) => g.memberCount).reduce((a, c) => a + c);

        let idx = 0;
        setInterval(() => {
            const activities = [`${getUsers()} Users`, `${client.guilds.cache.size} Servers`];

            idx = (idx + 1) % activities.length;
            const activity = activities[idx];

            client.user!.setActivity(activity, {
                type: ActivityType.Watching
            });
        }, 10 * 1000);

        cron.schedule('32 7 * * *', async () => {
            await startAutoDailyJob(client);
        });
    }
};

export default event;
