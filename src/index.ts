import { CLIENT_OPTIONS } from './constants';
import Bot from './structures/Bot';

export const bot = new Bot(CLIENT_OPTIONS);

bot.start();
