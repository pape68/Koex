import { SelectMenuInteraction } from 'discord.js';
import createOperationRequest from '../../api/mcp/createOperationRequest';

import { Component } from '../../interfaces/Component';
import { Accounts, SlotName, PresetData, SurvivorPresets } from '../../types/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'deletePresets',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const slots = interaction.values;

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

        const preset = slots.filter((v) => !!v).map((v) => presets[('slot_' + v) as SlotName]!);

        if (!preset) {
            interaction.editReply({
                embeds: [createEmbed('error', 'There is no preset data on this slot.')]
            });
            return;
        }

        preset.forEach(async (p) => {
            const target = Object.entries(presets)
                .filter(
                    ([k, v]) => k.startsWith('slot_') && !!v && (v as PresetData).name === p.name
                )
                .map(([k]) => k.split('_')[1])[0];

            const { error } = await supabase.from<SurvivorPresets>('survivor_presets').upsert({
                user_id: interaction.user.id,
                ['slot_' + target]: null
            });

            if (error) {
                await interaction.editReply({
                    embeds: [createEmbed('error', 'Failed to delete preset.')]
                });
                return;
            }
        });

        await interaction.editReply({
            embeds: [createEmbed('success', `Deleted survivor preset(s): "${preset.join('", "')}"`)]
        });
    }
};

export default selectMenu;
