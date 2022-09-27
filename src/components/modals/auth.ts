import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';

import createDeviceAuth from '../../api/auth/createDeviceAuth';
import createOAuthData from '../../api/auth/createOAuthData';
import { Color, fortniteClient } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import getCharacterAvatar from '../../utils/commands/getCharacterAvatar';
import { initializeAccounts } from '../../utils/functions/database';
import supabase from '../../utils/functions/supabase';

const modal: Component<ModalSubmitInteraction> = {
    name: 'auth',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.fields.getTextInputValue('code');

        const auth = await createOAuthData(fortniteClient.name, {
            grant_type: 'authorization_code',
            code
        });

        const deviceAuth = await createDeviceAuth(auth.access_token, auth.account_id);
        const accounts = await initializeAccounts(interaction.user.id);

        for (let i = 0; i < 5; i++) {
            if (i === 4) {
                await interaction.editReply({
                    embeds: [createEmbed('info', "Can't login to more than 5 accounts.")]
                });
                return;
            }

            const account = accounts[('slot_' + i) as SlotName];

            if (account?.accountId === deviceAuth.accountId) {
                await interaction.editReply({
                    embeds: [createEmbed('info', `Already logged into **${auth.displayName}**.`)]
                });
                return;
            }

            if (!account) {
                // TODO: MIGRATE TO A FUNCTION FROM "functions/database.ts"
                await supabase.from<Accounts>('accounts_test').upsert({
                    user_id: interaction.user.id,
                    ['slot_' + i]: {
                        accessToken: auth.access_token,
                        displayName: auth.displayName,
                        ...deviceAuth
                    },
                    active_slot: i
                });

                const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `Welcome, ${auth.displayName}`,
                                iconURL: characterAvatarUrl ?? undefined
                            })
                            .setColor(Color.GRAY)
                    ]
                });
                return;
            }
        }
    }
};

export default modal;
