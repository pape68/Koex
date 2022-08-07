import { ButtonInteraction, ComponentType } from 'discord.js';
import { getAuthCodeButton, menuComponents } from '../constants';
import { Button } from '../interfaces/Button';
import { Event } from '../interfaces/Event';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import loadCommands from '../utils/loadCommands';

export const event: Event = {
    execute: async (client: ExtendedClient) => {
        client.logger.info(`Logged in as ${client.user!.tag}!`);
        loadCommands(client);

        menuComponents.loggedIn.push(
            {
                type: ComponentType.ActionRow,
                components: [
                    (client.interactions.get('startDupe') as Button).options,
                    (client.interactions.get('julesDupe') as Button).options,
                    (client.interactions.get('stopDupe') as Button).options,
                    (client.interactions.get('logout') as Button).options
                ]
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    getAuthCodeButton,
                    (client.interactions.get('switchAccounts') as Button).options
                ]
            }
        );
        menuComponents.loggedOut.push({
            type: ComponentType.ActionRow,
            components: [getAuthCodeButton, (client.interactions.get('login') as Button).options]
        });
    },
    options: {
        once: true
    }
};

export default event;
