import { ChatInputApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';

import Bot from '../structures/Bot';

export interface Command {
    options: ChatInputApplicationCommandData;
    (client: Bot, interaction: ChatInputCommandInteraction): void;
}
