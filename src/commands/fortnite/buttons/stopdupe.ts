import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import { toggleDupe } from '../../../utils';
import { ExtendedClient } from '../../../interfaces/ExtendedClient';

const button: Button = {
    execute: async (client: ExtendedClient, interaction: ButtonInteraction) => {
        await toggleDupe(client, interaction, false);
    },
    options: {
        label: 'Stop Dupe',
        style: ButtonStyle.Secondary,
        customId: 'stopDupe',
        type: ComponentType.Button
    }
};

export default button;
