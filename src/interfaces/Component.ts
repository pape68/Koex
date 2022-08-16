import { ButtonInteraction, ModalSubmitInteraction } from 'discord.js';

export type ComponentInteraction = ButtonInteraction | ModalSubmitInteraction

export interface Component<T extends ComponentInteraction> {
    name: T['customId'];
    execute: (interaction: T) => Promise<any>;
}
