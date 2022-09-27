import { Component, ComponentInteraction } from '../../interfaces/Component';
import { Event } from '../../interfaces/Event';
import createEmbed from '../../utils/commands/createEmbed';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction: ComponentInteraction) => {
        if (interaction.isChatInputCommand()) return;

        if (interaction.user !== interaction.message?.interaction?.user) {
            await interaction.reply({
                embeds: [createEmbed('error', "This isn't for you.")],
                ephemeral: true
            });
            return;
        }

        if (['next', 'prev'].includes(interaction.customId)) return;

        const component = client.components.get(interaction.customId) as Component<ComponentInteraction> | undefined;

        try {
            if (component) await component.execute(interaction);
        } catch (err: any) {
            console.log(err);
            await interaction.editReply({
                embeds: [createEmbed('error', err.message ?? 'An unknown error occurred')]
            });
        }
    }
};

export default event;
1;
