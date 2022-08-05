import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import { toggleDupe } from '../../../utils';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    await toggleDupe(client, interaction, false);
};

execute.options = {
    label: 'Stop Dupe',
    style: ButtonStyle.Secondary,
    customId: 'stopDupe',
    type: ComponentType.Button
};

export default execute;
