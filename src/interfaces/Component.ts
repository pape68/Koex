import { ButtonInteraction, ModalSubmitInteraction, SelectMenuInteraction } from 'discord.js';

export type ComponentInteraction =
    | ButtonInteraction
    | ModalSubmitInteraction
    | SelectMenuInteraction;

export interface Component<T extends ComponentInteraction> {
    name: T['customId'];
    execute: (interaction: T) => Promise<any>;
}
