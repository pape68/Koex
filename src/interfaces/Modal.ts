import { ModalComponentData, ModalSubmitInteraction } from 'discord.js';

import Bot from '../structures/Bot';

export interface Modal {
    options: ModalComponentData;
    (client: Bot, interaction: ModalSubmitInteraction): void;
}
