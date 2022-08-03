import { ApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';

import Bot from '../structures/Bot';

export interface Command {
    options: ApplicationCommandData;
    (client: Bot, interaction: ChatInputCommandInteraction): void;
}
