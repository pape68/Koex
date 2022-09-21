import { ModalSubmitInteraction } from 'discord.js';

import composeMcp from '../../api/mcp/composeMcp';
import { Component } from '../../interfaces/Component';
import { Accounts, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const modal: Component<ModalSubmitInteraction> = {
    name: 'name-preset',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const name = interaction.fields.getTextInputValue('name');

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const profile = await composeMcp(auth, 'campaign', 'QueryProfile');

        if (!profile.data || profile.error) {
            interaction.followUp({
                embeds: [createEmbed('error', '`' + profile.error!.errorMessage + '`')]
            });
            return;
        }

        const items = profile.data.profileChanges[0].profile.items;

        const workers = Object.entries(items)
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

        const { data: account } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!account) {
            await interaction.followUp(defaultResponses.loggedOut);
            return;
        }

        for (let i = 0; i < 5; i++) {
            const presets = account[('slot_' + account.active_slot) as SlotName]?.survivorPresets;

            const data = presets ? presets[('slot_' + i) as SlotName] : null;

            if (data?.name === name) {
                await interaction.followUp({
                    embeds: [createEmbed('error', `You already have a preset named **${name}**.`)],
                    ephemeral: true
                });
                return;
            }

            if (!data) {
                await supabase.from<Accounts>('accounts_test').upsert({
                    user_id: interaction.user.id,
                    ['slot_' + account.active_slot]: {
                        ...account[('slot_' + account.active_slot) as SlotName],
                        survivorPresets: {
                            ...presets,
                            ['slot_' + i]: preset
                        }
                    }
                });

                await interaction.followUp({
                    embeds: [createEmbed('success', `Saved survivor preset **${name}**.`)],
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

export default modal;
