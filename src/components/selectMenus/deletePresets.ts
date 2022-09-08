import { SelectMenuInteraction } from 'discord.js';

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

        const preset = slots.filter((v) => !!v).map((v) => presets[('slot_' + v) as SlotName]!);

        if (!preset) {
            interaction.editReply({
                embeds: [createEmbed('error', 'There is no preset data on this slot.')]
            });
            return;
        }

        const { data: account } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!account) {
            await interaction.followUp(defaultResponses.loggedOut);
            return;
        }

        preset.forEach(async (p) => {
            const target = Object.entries(presets)
                .filter(
                    ([k, v]) => k.startsWith('slot_') && !!v && (v as PresetData).name === p.name
                )
                .map(([k]) => k.split('_')[1])[0];

            await supabase.from<Accounts>('accounts_test').upsert({
                user_id: interaction.user.id,
                ['slot_' + account.active_slot]: {
                    ...account[('slot_' + account.active_slot) as SlotName],
                    survivorPresets: {
                        ['slot_' + target]: null
                    }
                }
            });
        });

        const names = Object.values(presets)
            .filter((v) => !!v)
            .map((v) => v!.name);

        await interaction.editReply({
            embeds: [
                createEmbed('success', `Deleted survivor preset(s): **${names.join('**, **')}**`)
            ]
        });
    }
};

export default selectMenu;
