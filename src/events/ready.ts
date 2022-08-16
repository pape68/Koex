import { Event } from '../interfaces/Event';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import loadCommands from '../utils/handlers/loadCommands';
import loadComponents from '../utils/handlers/loadComponents';

export const event: Event<true> = {
    name: 'ready',
    execute: async (client: ExtendedClient) => {
        client.logger.info(`Logged in as ${client.user!.tag}!`);
        loadCommands(client);
        loadComponents(client)
    },
};

export default event;
