import { SelectMenuInteraction } from 'discord.js';
import createOperationRequest from '../../api/mcp/createOperationRequest';

import { Component } from '../../interfaces/Component';
import { SlotName } from '../../types/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import defaultResponses from '../../utils/helpers/defaultResponses';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'selectPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const slot = interaction.values[0];

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const presets = auth.survivorPresets;

        if (!presets) {
            await interaction.editReply({
                embeds: [createEmbed('error', "You don't have any survivor presets.")]
            });
            return;
        }

        const preset = presets[('slot_' + slot) as SlotName];

        if (!preset) {
            await interaction.editReply({
                embeds: [createEmbed('error', 'There is no preset data on this slot.')]
            });
            return;
        }

        const skipTutorialRes = await createOperationRequest(
            auth,
            'campaign',
            'AssignWorkerToSquadBatch',
            preset
        );

        if (skipTutorialRes.error) {
            interaction.editReply({
                embeds: [createEmbed('error', `Failed to apply preset **${preset.name}**.`)]
            });
        }

        await interaction.editReply({
            embeds: [createEmbed('success', `Using survivor preset **${preset.name}**.`)]
        });
    }
};

export default selectMenu;
