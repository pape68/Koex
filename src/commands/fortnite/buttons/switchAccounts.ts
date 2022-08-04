import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    await interaction.showModal(client.interactions.get('auth')!.options);
};

execute.options = {
    label: 'Switch Accounts',
    style: ButtonStyle.Secondary,
    customId: 'switchAccounts',
    type: ComponentType.Button
};

export default execute;
