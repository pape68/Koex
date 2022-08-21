import { Client, Collection } from 'discord.js';

import { CLIENT_OPTIONS } from './constants';
import { ExtendedClient } from './interfaces/ExtendedClient';
import loadEvents from './utils/handlers/loadEvents';

export const bot = new Client(CLIENT_OPTIONS) as ExtendedClient;

bot.cooldowns = new Collection();
bot.interactions = new Collection();

(async () => {
    await bot.login(process.env.DISCORD_TOKEN);
    loadEvents(bot);
})();

process
    .on('exit', (code) => {
        bot.destroy();
        console.info(`Node.js process exited with code ${code}`);
    })
    .on('uncaughtException', (err) =>
        console.error(`Uncaught exception: ${err.stack}`)
    )
    .on('unhandledRejection', (err) =>
        console.error(`Unhandled rejection: ${(err as Error).stack ?? err}`)
    );
