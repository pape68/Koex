import { Client, Collection } from 'discord.js';

import { CLIENT_OPTIONS } from './constants';
import { ExtendedClient } from './interfaces/ExtendedClient';
import { loadEvents, logger, supabase } from './utils';

export const bot = new Client(CLIENT_OPTIONS) as ExtendedClient;

bot.interactions = new Collection();
bot.cooldowns = new Collection();
bot.logger = logger;
bot.supabase = supabase;

(async () => {
    await bot.login(process.env.DISCORD_TOKEN);
    loadEvents(bot);
})();

process.on('uncaughtException', (err) => {
    bot.logger.error(`Caught exception: ${err.stack}`);
});
