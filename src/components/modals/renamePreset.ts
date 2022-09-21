import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';

import createDeviceAuth from '../../api/auth/createDeviceAuth';
import createOAuthData from '../../api/auth/createOAuthData';
import { Color, fortniteClient } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import getCharacterAvatar from '../../utils/commands/getCharacterAvatar';
import refreshAuthData from '../../utils/commands/refreshAuthData';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const modal: Component<ModalSubmitInteraction> = {
    name: 'rename-preset',
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

        const oldName = interaction.fields.getTextInputValue('old-name');
        const newName = interaction.fields.getTextInputValue('new-name');

        for (let i = 0; i < 5; i++) {
            const data = presets ? presets[('slot_' + i) as SlotName] : null;

            if (data?.name === newName) {
                await interaction.followUp({
                    embeds: [createEmbed('error', `You already have a preset named **${newName}**.`)],
                    ephemeral: true
                });
                return;
            }
        }

        const target = Object.entries(presets ?? {})
            .filter(([k, v]) => k.startsWith('slot_') && !!v && v.name === oldName)
            .map(([k]) => k.split('_')[1])[0];

        if (!target) {
            await interaction.followUp({
                embeds: [createEmbed('info', `You don't have a survivor preset named ${oldName}.`)],
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
		    ...presets,
                    ['slot_' + target]: {
                        ...presets[('slot_' + target) as SlotName],
                        name: newName
                    }
                }
            }
        });

        await interaction.followUp({
            embeds: [createEmbed('success', `Renamed survivor preset to **${newName}**.`)],
            ephemeral: true
        });
        return;
    }
};

export default modal;
