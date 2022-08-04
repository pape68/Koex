import { CLIENT_OPTIONS } from './constants';
import Bot from './structures/Bot';

export const bot = new Bot(CLIENT_OPTIONS);

bot.start();

process.on('uncaughtException', (err) => {
    bot.logger.error(`Caught exception: ${err}`);
});
