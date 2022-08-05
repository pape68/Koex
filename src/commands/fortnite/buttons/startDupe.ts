import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import { toggleDupe } from '../../../utils';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    toggleDupe(client, interaction, true);
};

execute.options = {
    label: 'Start Dupe',
    style: ButtonStyle.Success,
    customId: 'startDupe',
    type: ComponentType.Button
};

export default execute;
