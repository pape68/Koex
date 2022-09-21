import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, Message, SelectMenuBuilder } from 'discord.js';

import { Color } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, PresetData, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const button: Component<ButtonInteraction> = {
    name: 'renameSurvivorPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        let n = -1;
        const options = Object.entries(auth.survivorPresets ?? {})
            .filter(([k, v]) => k.startsWith('slot_') && !!v && (v as PresetData).name)
            .map(([, v]) => {
                const { name } = v as PresetData;

                n++;
                return { label: name!, description: (n + 1).toString(), value: n.toString() };
            });

        if (!options.length) {
            await interaction.editReply({
                embeds: [createEmbed('info', "You don't have any survivor presets.")]
            });
            return;
        }

        const embed = new EmbedBuilder().setColor(Color.GRAY).addFields([
            {
                name: 'Renaming Preset',
                value: `Use the select menu below to rename a survivor preset.`
            }
        ]);

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setPlaceholder('Select Preset')
                .setCustomId('renamePreset')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(options)
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default button;
