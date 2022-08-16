import { ButtonInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import toggleDupe from '../../utils/commands/toggleDupe';

const button: Component<ButtonInteraction> = {
    name: 'stopDupe',
    execute: async (interaction) => await toggleDupe(interaction, false)
};

export default button;
