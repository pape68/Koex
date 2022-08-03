import { ButtonComponentData, ButtonInteraction } from 'discord.js';

import Bot from '../structures/Bot';

export interface Button {
    options: ButtonComponentData;
    (client: Bot, interaction: ButtonInteraction): void;
}
