import { SelectMenuInteraction } from 'discord.js';
import createOperationRequest from '../../api/mcp/createOperationRequest';

import { Component } from '../../interfaces/Component';
import { Accounts, SlotName, PresetData, SurvivorPresets } from '../../types/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'selectPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const slot = interaction.values[0];

        const { data: presets, error } = await supabase
            .from<SurvivorPresets>('survivor_presets')
            .upsert({ user_id: interaction.user.id })
            .single();

        if (error) {
            await interaction.editReply(defaultResponses.retrievalError);
            return;
        }

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
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
                embeds: [createEmbed('error', `Failed to apply preset "${preset.name}".`)]
            });
        }

        await interaction.editReply({
            embeds: [createEmbed('success', `Using survivor preset "${preset.name}".`)]
        });
    }
};

export default selectMenu;
