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

        setInterval(() => {
            client.user!.setActivity(`${client.guilds.cache.size} Servers`, {
                type: ActivityType.Watching
            });
        }, 60 * 1000);

        cron.schedule('0 0 * * *', async () => {
            await startAutoDailyJob(client);
        });
    }
};

export default event;
