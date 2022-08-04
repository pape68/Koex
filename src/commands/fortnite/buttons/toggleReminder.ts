import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    interaction.deferReply({ ephemeral: true });

    const instance = client.supabase.from('fortnite');

    const { data, error: matchError } = await instance
        .select('*')
        .match({
            user_id: interaction.user.id
        })
        .single();

    if (matchError) {
        client.logger.error(matchError);
        return interaction.editReply('An error occurred while retrieving your preferences.');
    }

    const { error: upsertError } = await instance.upsert({
        user_id: interaction.user.id,
        no_reminders: !JSON.parse(data.no_reminders ?? false)
    });

    if (upsertError) {
        client.logger.error(upsertError);
        return interaction.editReply('An error occurred while updating your preferences.');
    }

    return interaction.editReply(
        `Toggled reminder status to: **${data.no_reminders ? 'Off' : 'On'}**`
    );
};

execute.options = {
    label: 'Toggle Dupe Reminder',
    style: ButtonStyle.Secondary,
    customId: 'toggleReminder',
    type: ComponentType.Button
};

export default execute;
