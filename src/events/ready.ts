import axios from 'axios';
import { ComponentType } from 'discord.js';
import { getAuthCodeButton, menuComponents } from '../constants';
import { Event } from '../interfaces/Event';
import Bot from '../structures/Bot';

const execute: Event = async (client: Bot) => {
    client.logger.info(`Logged in as ${client.user!.tag}!`);
    client.loadCommands();

    menuComponents.loggedIn.push(
        {
            type: ComponentType.ActionRow,
            components: [
                client.interactions.get('startDupe')!.options,
                client.interactions.get('stopDupe')!.options,
                client.interactions.get('logout')!.options
            ]
        },
        {
            type: ComponentType.ActionRow,
            components: [getAuthCodeButton, client.interactions.get('switchAccounts')!.options]
        },
        {
            type: ComponentType.ActionRow,
            components: [client.interactions.get('toggleReminder')!.options]
        }
    );
    menuComponents.loggedOut.push({
        type: ComponentType.ActionRow,
        components: [getAuthCodeButton, client.interactions.get('login')!.options]
    });
};

export default execute;
