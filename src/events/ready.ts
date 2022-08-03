import { Event } from '../interfaces/Event';
import Bot from '../structures/Bot';

const execute: Event = (client: Bot) => {
    client.logger.info(`Logged in as ${client.user!.tag}!`);
    client.loadCommands();
};

export default execute;
