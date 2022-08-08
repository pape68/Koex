import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import { toggleDupe } from '../../../utils';
import { ExtendedClient } from '../../../interfaces/ExtendedClient';

const button: Button = {
    execute: async (client: ExtendedClient, interaction: ButtonInteraction) => {
        if (interaction.user.id === '569212600785567777')
            return interaction.reply("Sorry, you can't use this command while blacklisted.");
        await toggleDupe(client, interaction, true);
    },
    options: {
        label: 'Start Dupe',
        style: ButtonStyle.Success,
        customId: 'startDupe',
        type: ComponentType.Button
    }
};

export default button;
