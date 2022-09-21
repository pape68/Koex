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

        //

        // const reply = await interaction.deferReply({ ephemeral: true, fetchReply: true });

        // const auth = await refreshAuthData(interaction.user.id);

        // if (!auth) {
        //     await interaction.editReply(defaultResponses.loggedOut);
        //     return;
        // }
        // const presets = auth.survivorPresets;

        // if (!presets) {
        //     await interaction.editReply({
        //         embeds: [createEmbed('error', "You don't have any survivor presets.")]
        //     });
        //     return;
        // }

        // const embed = new EmbedBuilder()
        //     .setColor(Color.GRAY)
        //     .setFields([
        //         {
        //             name: 'Renaming Preset',
        //             value: 'Type the old name of your survivor preset **FOLLOWED BY** the new name below.\n**(10 seconds)**'
        //         }
        //     ])
        //     .setFooter(interaction.message.embeds[0].footer)
        //     .setTimestamp();

        // await interaction.editReply({ embeds: [embed], components: [], files: [] });

        // const channel = await interaction.user.createDM().then(() => reply.channel);

        // await channel.sendTyping();

        // const filter = (message: Message) => message.author.id === interaction.user.id;

        // const preset = await channel
        //     .awaitMessages({ filter, max: 2, time: 30 * 1000, errors: ['time'] })
        //     .then((collected) => {
        //         collected.forEach((item) => {
        //             if (item.content.length > 16) {
        //                 interaction.followUp({
        //                     embeds: [createEmbed('error', 'Please limit the name to 16 characters.')],
        //                     ephemeral: true
        //                 });
        //                 return null;
        //             }
        //         });
        //         return {
        //             oldName: collected.first()!.content,
        //             newName: collected.last()!.content
        //         };
        //     })
        //     .catch((_collected) => {
        //         interaction.followUp({
        //             embeds: [createEmbed('error', 'Timed out, no response received.')],
        //             ephemeral: true
        //         });
        //         return null;
        //     });

        // if (!preset) return;

        // for (let i = 0; i < 5; i++) {
        //     const data = presets ? presets[('slot_' + i) as SlotName] : null;

        //     if (data?.name === preset.newName) {
        //         await interaction.followUp({
        //             embeds: [createEmbed('error', `You already have a preset named **${preset.newName}**.`)],
        //             ephemeral: true
        //         });
        //         return;
        //     }
        // }

        // const target = Object.entries(presets ?? {})
        //     .filter(([k, v]) => k.startsWith('slot_') && !!v && (v as PresetData).name === preset.oldName)
        //     .map(([k]) => k.split('_')[1])[0];

        // if (!target) {
        //     await interaction.followUp({
        //         embeds: [createEmbed('info', `You don't have a survivor preset named ${preset.oldName}.`)],
        //         ephemeral: true
        //     });
        //     return;
        // }

        // const { data: account } = await supabase
        //     .from<Accounts>('accounts_test')
        //     .select('*')
        //     .match({ user_id: interaction.user.id })
        //     .maybeSingle();

        // if (!account) {
        //     await interaction.followUp(defaultResponses.loggedOut);
        //     return;
        // }

        // await supabase.from<Accounts>('accounts_test').upsert({
        //     user_id: interaction.user.id,
        //     ['slot_' + account.active_slot]: {
        //         ...account[('slot_' + account.active_slot) as SlotName],
        //         survivorPresets: {
        //             ['slot_' + target]: {
        //                 ...presets[('slot_' + target) as SlotName],
        //                 name: preset.newName
        //             }
        //         }
        //     }
        // });

        // await interaction.followUp({
        //     embeds: [createEmbed('success', `Renamed survivor preset to **${preset.newName}**.`)],
        //     ephemeral: true
        // });
        // return;
    }
};

export default button;
