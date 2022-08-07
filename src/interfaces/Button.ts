import { ButtonInteraction, InteractionButtonComponentData } from 'discord.js';

import { ExtendedClient } from './ExtendedClient';

export interface Button {
    options: InteractionButtonComponentData;
    execute: (client: ExtendedClient, interaction: ButtonInteraction) => Promise<any>;
}
