import { ButtonInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import toggleDupe from '../../utils/commands/toggleDupe';

const button: Component<ButtonInteraction> = {
    name: 'startDupe',
    execute: async (interaction) => await toggleDupe(true, interaction)
};

export default button;
