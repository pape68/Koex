import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    await interaction.showModal(client.interactions.get('auth')!.options);

    interaction.message.delete();
};

execute.options = {
    label: 'Login',
    style: ButtonStyle.Primary,
    customId: 'login',
    type: ComponentType.Button
};

export default execute;
