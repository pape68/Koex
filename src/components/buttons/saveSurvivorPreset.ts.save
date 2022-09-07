import { ButtonInteraction, EmbedBuilder, Message } from 'discord.js';

import { Component } from '../../interfaces/Component';
import { COLORS } from '../../constants';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import defaultResponses from '../../utils/helpers/defaultResponses';
import createOperationRequest from '../../api/mcp/createOperationRequest';
import { FortniteItem } from '../../api/types';
import supabase from '../../utils/functions/supabase';
import { SlotName, SurvivorPresets } from '../../types/supabase';

const button: Component<ButtonInteraction> = {
    name: 'saveSurvivorPreset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(COLORS.gray)
            .setFields([
                {
                    name: 'Naming Preset',
                    value: 'Type the name of your new survivor preset below **(10 seconds)**.'
                }
            ])
            .setFooter(interaction.message.embeds[0].footer)
            .setTimestamp();

        const dmChannel = interaction.channel?.isDMBased()
            ? await interaction.user.createDM()
            : null;

        const channel = dmChannel ?? interaction.channel;

        if (!channel) {
            interaction.editReply({
                embeds: [createEmbed('error', 'Failed to find your current channel.')]
            });
            return;
        }

        await interaction.editReply({ embeds: [embed], components: [], files: [] });
        await interaction.channel?.sendTyping();

        const filter = (message: Message) => message.author.id === interaction.user.id;

        const name = await channel
            .awaitMessages({ filter, max: 1, time: 30 * 1000, errors: ['time'] })
            .then((collected) => {
                if (collected.last()!.content.length > 16) {
                    interaction.followUp({
                        embeds: [createEmbed('error', 'Please limit the name to 16 characters.')],
                        ephemeral: true
                    });
                    return null;
                }

                return collected.last()!.content;
            })
            .catch((_collected) => {
                interaction.followUp({
                    embeds: [createEmbed('error', 'Timed out, no response received.')],
                    ephemeral: true
                });
                return null;
            });

        if (!name) return;

        const queryProfileRes = await createOperationRequest(auth, 'campaign', 'QueryProfile');

        if (queryProfileRes.error) {
            interaction.followUp({
                embeds: [createEmbed('error', '`' + queryProfileRes.error.message + '`')]
            });
            return;
        }

        const profileItems: FortniteItem[] = queryProfileRes.data?.profileChanges[0].profile.items;

        const workers = Object.entries(profileItems)
            .filter(([, v]) => v.templateId.startsWith('Worker:') && v.attributes.squad_id)
            .map(([k, v]) => ({
                characterId: k,
                squadId: v.attributes.squad_id,
                slotIdx: v.attributes.squad_slot_idx
            }));

        const characterIds: string[] = [];
        const squadIds: string[] = [];
        const slotIndices: number[] = [];

        for (const worker of workers) {
            characterIds.push(worker.characterId);
            squadIds.push(worker.squadId ?? '');
            slotIndices.push(worker.slotIdx ?? 0);
        }

        const preset = {
            name,
            characterIds,
            squadIds,
            slotIndices
        };

        const { data: presets, error } = await supabase
            .from<SurvivorPresets>('survivor_presets')
            .upsert({ user_id: interaction.user.id })
            .single();

        if (!presets) {
            interaction.editReply(
                "This shouldn't be possible, so uhh. (Probably not the llama you're looking for.)"
            );
            return;
        }

        if (error) {
            await interaction.followUp({ ...defaultResponses.retrievalError, ephemeral: true });
            return;
        }

        for (let i = 0; i < 5; i++) {
            const data = presets[('slot_' + i) as SlotName];

            if (data?.name === name) {
                await interaction.followUp({
                    embeds: [createEmbed('error', `You already have a preset named "${name}".`)],
                    ephemeral: true
                });
                return;
            }

            if (!data) {
                await supabase.from<SurvivorPresets>('survivor_presets').upsert({
                    user_id: interaction.user.id,
                    ['slot_' + i]: preset
                });

                await interaction.followUp({
                    embeds: [createEmbed('success', `Saved survivor preset "${name}".`)],
                    ephemeral: true
                });
                return;
            }

            if (i === 4) {
                interaction.editReply({
                    embeds: [createEmbed('info', "Can't save more than 5 presets.")]
                });
                return;
            }
        }
    }
};

export default button;
