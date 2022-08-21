import { ModalSubmitInteraction } from 'discord.js';

import createDeviceAuth from '../../api/auth/createDeviceAuth';
import createOAuthData from '../../api/auth/createOAuthData';
import { FORTNITE_CLIENT } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, SlotName } from '../../types/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const modal: Component<ModalSubmitInteraction> = {
    name: 'auth',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.fields.getTextInputValue('code');

        const oAuthData = await createOAuthData(FORTNITE_CLIENT.client, {
            grant_type: 'authorization_code',
            code
        });

        if (!oAuthData) return interaction.editReply(defaultResponses.authError);

        const accessToken = oAuthData.access_token;
        const accountId = oAuthData.account_id;

        const deviceAuth = await createDeviceAuth(accessToken, accountId);

        if (!deviceAuth) return interaction.editReply(defaultResponses.authError);

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .upsert({ user_id: interaction.user.id })
            .single();

        if (!account) return interaction.editReply(defaultResponses.loggedOut);

        if (error) return interaction.editReply(defaultResponses.authError);

        for (let i = 0; i < 5; i++) {
            const auth = account[('slot_' + i) as SlotName];

            if (auth?.accountId === deviceAuth.accountId) {
                return interaction.editReply({
                    embeds: [createEmbed('info', `Already logged into **${oAuthData.displayName}**.`)]
                });
            }

            if (!auth) {
                await supabase.from<Accounts>('accounts_test').upsert({
                    user_id: interaction.user.id,
                    ['slot_' + i]: {
                        accessToken: oAuthData.access_token,
                        displayName: oAuthData.displayName,
                        ...deviceAuth
                    },
                    active_slot: i
                });

                return interaction.editReply({
                    embeds: [createEmbed('success', `Logged in as **${oAuthData.displayName}**.`)]
                });
            }

            if (i === 4) {
                return interaction.editReply({
                    embeds: [createEmbed('info', "Can't login to more than 5 accounts.")]
                });
            }
        }
    }
};

export default modal;
