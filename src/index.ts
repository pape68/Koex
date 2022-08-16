import { Client, Collection } from 'discord.js';

import { CLIENT_OPTIONS } from './constants';
import { ExtendedClient } from './interfaces/ExtendedClient';
import logger from './utils/functions/logger';
import loadEvents from './utils/handlers/loadEvents';

export const bot = new Client(CLIENT_OPTIONS) as ExtendedClient;

bot.interactions = new Collection();
bot.cooldowns = new Collection();
bot.logger = logger;

(async () => {
    await bot.login(process.env.DISCORD_TOKEN);
    loadEvents(bot);
})();

process.on('uncaughtException', (err) => {
    bot.logger.error(`Caught exception: ${err.stack}`);
});
