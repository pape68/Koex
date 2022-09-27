import { SelectMenuInteraction } from 'discord.js';
import composeMcp from '../../api/mcp/composeMcp';

import { Component } from '../../interfaces/Component';
import { SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'selectPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const slot = interaction.values[0];

        const auth = await refreshAuthData(interaction.user.id, undefined, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const presets = auth!.survivorPresets;

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

        await composeMcp(auth!, 'campaign', 'AssignWorkerToSquadBatch', preset);
        await interaction.editReply({
            embeds: [createEmbed('success', `Using survivor preset **${preset.name}**.`)]
        });
    }
};

export default selectMenu;
