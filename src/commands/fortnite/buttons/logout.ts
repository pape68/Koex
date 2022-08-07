import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import { menuComponents, menuEmbed } from '../../../constants';
import { ExtendedClient } from '../../../interfaces/ExtendedClient';

const button: Button = {
    execute: async (client: ExtendedClient, interaction: ButtonInteraction) => {
        await interaction.deferReply({ ephemeral: true });

        const { error: deleteError } = await client.supabase.from('fortnite').delete().match({
            user_id: interaction.user.id
        });

        if (deleteError) {
            client.logger.error(deleteError);
            return interaction.editReply(
                'An error occurred while logging you out. Please try again.'
            );
        }

        const embed = menuEmbed.setAuthor({ name: 'Not Logged In' });

        interaction.user.createDM().then(() => {
            interaction.message?.edit({
                embeds: [embed],
                components: menuComponents.loggedOut
            });
        });

        interaction.editReply('Successfully logged out.');
    },
    options: {
        label: 'Logout',
        style: ButtonStyle.Danger,
        customId: 'logout',
        type: ComponentType.Button
    }
};

export default button;
