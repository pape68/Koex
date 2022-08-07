import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import { ExtendedClient } from '../../../interfaces/ExtendedClient';
import { Modal } from '../../../interfaces/Modal';

const button: Button = {
    execute: async (client: ExtendedClient, interaction: ButtonInteraction) => {
        await interaction.showModal((client.interactions.get('auth') as Modal).options);
    },
    options: {
        label: 'Switch Accounts',
        style: ButtonStyle.Secondary,
        customId: 'switchAccounts',
        type: ComponentType.Button
    }
};

export default button;
