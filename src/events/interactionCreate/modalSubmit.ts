import { InteractionType, ModalSubmitInteraction } from 'discord.js';

import { Event } from '../../interfaces/Event';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import { Modal } from '../../interfaces/Modal';

const event: Event = {
    execute: async (client: ExtendedClient, interaction: ModalSubmitInteraction) => {
        if (interaction.type !== InteractionType.ModalSubmit || interaction.guild) return;

        try {
            (client.interactions.get(interaction.customId) as Modal).execute(client, interaction);
        } catch (err) {
            client.logger.error(err);
        }
    },
    options: {
        name: 'interactionCreate'
    }
};

export default event;
