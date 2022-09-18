import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';

import createDeviceAuth from '../../api/auth/createDeviceAuth';
import createOAuthData from '../../api/auth/createOAuthData';
import { Color, fortniteClient } from '../../constants';
import { Component } from '../../interfaces/Component';
import { Accounts, SlotName } from '../../typings/supabase';
import createEmbed from '../../utils/commands/createEmbed';
import getCharacterAvatar from '../../utils/commands/getCharacterAvatar';
import supabase from '../../utils/functions/supabase';
import defaultResponses from '../../utils/helpers/defaultResponses';

const modal: Component<ModalSubmitInteraction> = {
    name: 'auth',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.fields.getTextInputValue('code');

        const oAuthData = await createOAuthData(fortniteClient.name, {
            grant_type: 'authorization_code',
            code
        });

        if (!oAuthData) {
            await interaction.editReply(defaultResponses.authError);
            return;
        }

        const accessToken = oAuthData.access_token;
        const accountId = oAuthData.account_id;

        const deviceAuth = await createDeviceAuth(accessToken, accountId);

        if (!deviceAuth) {
            await interaction.editReply(defaultResponses.authError);
            return;
        }

        const { data: account } = await supabase
            .from<Accounts>('accounts_test')
            .upsert({ user_id: interaction.user.id })
            .single();

        if (!account) {
            await interaction.editReply(
                "This shouldn't be possible, so some weird shit happened. (Probably not the llama you're looking for.)"
            );
            return;
        }

        for (let i = 0; i < 5; i++) {
            const auth = account[('slot_' + i) as SlotName];

            if (auth?.accountId === deviceAuth.accountId) {
                await interaction.editReply({
                    embeds: [createEmbed('info', `Already logged into **${oAuthData.displayName}**.`)]
                });
                return;
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

                const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `Welcome, ${oAuthData.displayName}`,
                                iconURL: characterAvatarUrl ?? undefined
                            })
                            .setColor(Color.GRAY)
                    ]
                });
                return;
            }

            if (i === 4) {
                await interaction.editReply({
                    embeds: [createEmbed('info', "Can't login to more than 5 accounts.")]
                });
                return;
            }
        }
    }
};

export default modal;
