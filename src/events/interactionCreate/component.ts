import { Component, ComponentInteraction } from '../../interfaces/Component';
import { Event } from '../../interfaces/Event';
import createEmbed from '../../utils/commands/createEmbed';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ComponentInteraction) => {
        if (interaction.isChatInputCommand()) return;

        if (interaction.user !== interaction.message?.interaction?.user) {
            return interaction.reply({
                embeds: [createEmbed('error', "This isn't for you.")],
                ephemeral: true
            });
        }

        const component = client.interactions.get(interaction.customId) as
            | Component<ComponentInteraction>
            | undefined;

        if (!component) {
            return interaction.reply({
                embeds: [createEmbed('error', "Couldn't find this component.", false)],
                ephemeral: true
            });
        }

        return component.execute(interaction).catch((error) => {
            console.error(error);
            if (interaction.deferred || interaction.replied) return;
            interaction.reply({
                embeds: [
                    createEmbed('error', 'An error occurred while running this component.', false)
                ],
                ephemeral: true
            });
        });
    }
};

export default event;
1;
