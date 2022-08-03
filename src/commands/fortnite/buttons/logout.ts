import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    interaction.deferReply({
        ephemeral: true
    });

    const { error } = await client.supabase
        .from('fortnite')
        .delete()
        .match({
            user_id: interaction.user.id
        })
        .single();

    if (error) {
        client.logger.error(error);
        return interaction.editReply('An internal error occurred. Please try again.');
    }

    return interaction.message.delete().then(() => {
        interaction.editReply('Successfully logged out.');
    });
};

execute.options = {
    label: 'Logout',
    style: ButtonStyle.Danger,
    customId: 'logout',
    type: ComponentType.Button
};

export default execute;
