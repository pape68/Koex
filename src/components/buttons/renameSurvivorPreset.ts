import { ButtonInteraction, EmbedBuilder, Message } from 'discord.js';

import { Component } from '../../interfaces/Component';
import { COLORS } from '../../constants';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import defaultResponses from '../../utils/helpers/defaultResponses';
import supabase from '../../utils/functions/supabase';
import { SlotName, SurvivorPresets, PresetData, Accounts } from '../../types/supabase';
import _ from 'lodash';

const button: Component<ButtonInteraction> = {
    name: 'renameSurvivorPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

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

        const embed = new EmbedBuilder()
            .setColor(COLORS.gray)
            .setFields([
                {
                    name: 'Renaming Preset',
                    value: 'Type the old name of your survivor preset **FOLLOWED BY** the new name below.\n**(10 seconds)**'
                }
            ])
            .setFooter(interaction.message.embeds[0].footer)
            .setTimestamp();

        const channel = interaction.channel?.isDMBased()
            ? await interaction.user.createDM()
            : interaction.channel;

        if (!channel) {
            interaction.editReply({
                embeds: [createEmbed('error', 'Failed to find your current channel.')]
            });
            return;
        }

        await interaction.editReply({ embeds: [embed], components: [], files: [] });
        await interaction.channel?.sendTyping();

        const filter = (message: Message) => message.author.id === interaction.user.id;

        const preset = await channel
            .awaitMessages({ filter, max: 2, time: 30 * 1000, errors: ['time'] })
            .then((collected) => {
                collected.forEach((item) => {
                    if (item.content.length > 16) {
                        interaction.followUp({
                            embeds: [
                                createEmbed('error', 'Please limit the name to 16 characters.')
                            ],
                            ephemeral: true
                        });
                        return null;
                    }
                });
                return {
                    oldName: collected.first()!.content,
                    newName: collected.last()!.content
                };
            })
            .catch((_collected) => {
                interaction.followUp({
                    embeds: [createEmbed('error', 'Timed out, no response received.')],
                    ephemeral: true
                });
                return null;
            });

        if (!preset) return;

        for (let i = 0; i < 5; i++) {
            const data = presets ? presets[('slot_' + i) as SlotName] : null;

            if (data?.name === preset.newName) {
                await interaction.followUp({
                    embeds: [
                        createEmbed('error', `You already have a preset named "${preset.newName}".`)
                    ],
                    ephemeral: true
                });
                return;
            }
        }

        const target = Object.entries(presets ?? {})
            .filter(
                ([k, v]) =>
                    k.startsWith('slot_') && !!v && (v as PresetData).name === preset.oldName
            )
            .map(([k]) => k.split('_')[1])[0];

        if (!target) {
            await interaction.followUp({
                embeds: [
                    createEmbed('info', `You don't have a survivor preset named ${preset.oldName}.`)
                ],
                ephemeral: true
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

        await supabase.from<Accounts>('accounts_test').upsert({
            user_id: interaction.user.id,
            ['slot_' + account.active_slot]: {
                ...account[('slot_' + account.active_slot) as SlotName],
                survivorPresets: {
                    ['slot_' + target]: {
                        ...presets[('slot_' + target) as SlotName],
                        name: preset.newName
                    }
                }
            }
        });

        await interaction.followUp({
            embeds: [createEmbed('success', `Renamed survivor preset to "${preset.newName}".`)],
            ephemeral: true
        });
        return;
    }
};

export default button;
