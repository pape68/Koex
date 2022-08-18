import { InteractionType, ModalSubmitInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import { Event } from '../../interfaces/Event';
import createEmbed from '../../utils/functions/createEmbed';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ModalSubmitInteraction) => {
        if (interaction.type !== InteractionType.ModalSubmit) return;

        if (interaction.user !== interaction.message?.interaction!.user) {
            return interaction.reply({
                embeds: [createEmbed('error', "This modal isn't for you.")],
                ephemeral: true
            });
        }

        (client.interactions.get(interaction.customId) as Component<ModalSubmitInteraction>)
            .execute(interaction)
            .catch((error) => console.error(error));
    }
};

export default event;
