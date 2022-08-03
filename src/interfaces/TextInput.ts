import { ButtonInteraction, TextInputComponentData } from 'discord.js';

import Bot from '../structures/Bot';

export interface TextInput {
    options: TextInputComponentData;
    (client: Bot, interaction: ButtonInteraction): void;
}
