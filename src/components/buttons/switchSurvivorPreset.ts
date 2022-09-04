import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, SelectMenuBuilder } from 'discord.js';

import { COLORS } from '../../constants';
import { Component } from '../../interfaces/Component';
import { PresetData, SurvivorPresets } from '../../types/supabase';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';
import createEmbed from '../../utils/commands/createEmbed';

const button: Component<ButtonInteraction> = {
    name: 'switchSurvivorPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const { data: presets, error } = await supabase
            .from<SurvivorPresets>('survivor_presets')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (error) {
            await interaction.editReply(defaultResponses.retrievalError);
            return;
        }

        let n = -1;
        const options = Object.entries(presets ?? {})
            .filter(([k, v]) => k.startsWith('slot_') && !!v && (v as PresetData).name)
            .map(([, v]) => {
                const { name } = v as PresetData;

                n++;
                return { label: name!, description: (n + 1).toString(), value: n.toString() };
            });

        if (!presets || !options.length) {
            await interaction.editReply({
                embeds: [createEmbed('info', "You don't have any survivor presets.")]
            });
            return;
        }

        const embed = new EmbedBuilder().setColor(COLORS.gray).addFields([
            {
                name: 'Switching Presets',
                value: `Use the select menu below to switch survivor presets.`
            }
        ]);

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setPlaceholder('Select Preset')
                .setCustomId('selectPreset')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(options)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default button;
