import { ChatInputApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';

import { ExtendedClient } from './ExtendedClient';

export interface Command {
    options: ChatInputApplicationCommandData;
    execute: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => Promise<any>;
}
