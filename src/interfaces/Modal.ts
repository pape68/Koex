import { InteractionType, ModalComponentData, ModalSubmitInteraction } from 'discord.js';

import { ExtendedClient } from './ExtendedClient';

export interface Modal {
    options: { type: InteractionType.ModalSubmit } & ModalComponentData;
    execute: (client: ExtendedClient, interaction: ModalSubmitInteraction) => Promise<any>;
}
