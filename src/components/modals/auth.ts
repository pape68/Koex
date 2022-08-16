import { inlineCode, ModalSubmitInteraction } from 'discord.js';
import qs from 'qs';

import { FORTNITE_BASIC_AUTH } from '../../constants';
import { Component } from '../../interfaces/Component';
import { UserData } from '../../typings';
import { Accounts, AuthData, DeviceAuth } from '../../typings/supabase';
import { Endpoints } from '../../utils/constants/classes';
import { EpicServices } from '../../utils/constants/enums';
import createEmbed from '../../utils/functions/createEmbed';
import getUserData from '../../utils/functions/getUserData';
import refreshUserData from '../../utils/functions/refreshUserData';
import request from '../../utils/functions/request';
import supabase from '../../utils/functions/supabase';

const modal: Component<ModalSubmitInteraction> = {
    name: 'auth',
    execute: async (interaction) => {
        await interaction.deferReply();

        const code = interaction.fields.getTextInputValue('code');

        try {
            const userDataHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: FORTNITE_BASIC_AUTH
            };

            const userDataBody = qs.stringify({
                grant_type: 'authorization_code',
                code
            });

            const endpoints = new Endpoints();
            const userDataRes = await request<UserData>(
                'POST',
                endpoints.oauthTokenCreate,
                null,
                userDataHeaders,
                userDataBody
            );

            if (userDataRes.error) throw userDataRes.error;

            if (!userDataRes.data) return;

            const { access_token, account_id } = userDataRes.data;

            const deviceAuthHeaders = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`
            };

            const deviceAuthRes = await request<DeviceAuth>(
                'POST',
                endpoints.oauthDeviceAuth + `/${account_id}/deviceAuth`,
                null,
                deviceAuthHeaders
            );

            if (deviceAuthRes.error) throw deviceAuthRes.error;

            if (!deviceAuthRes.data) return;

            delete deviceAuthRes.data.userAgent;
            delete deviceAuthRes.data.created;

            const user: Accounts = await getUserData(interaction.user.id, interaction, false);

            for (let i = 0; i < 5; i++) {
                if (user['slot_' + i].accountId === deviceAuthRes.data.accountId) {
                    return interaction.editReply({
                        embeds: [
                            createEmbed(
                                'info',
                                `Account **${userDataRes.data!.displayName}** is already on slot ${inlineCode(
                                    (i + 1).toString()
                                )}.`
                            )
                        ]
                    });
                }

                if (Object.keys(user['slot_' + i]).length === 0) {
                    await supabase.from<Accounts>('accounts').upsert({
                        user_id: interaction.user.id,
                        ['slot_' + i]: {
                            ...deviceAuthRes.data,
                            ...refreshUserData(interaction.user.id, interaction, deviceAuthRes.data)
                        },
                        active_slot: i
                    });

                    return interaction.editReply({
                        embeds: [
                            createEmbed(
                                'success',
                                `Added account **${userDataRes.data!.displayName}** on slot ${inlineCode(
                                    (i + 1).toString()
                                )}.`
                            )
                        ]
                    });
                }

                if (i === 4) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', "Can't connect more than 5 accounts.")]
                    });
                }
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({
                embeds: [createEmbed('error', 'An unknown error occurred. Please try again.')]
            });
        }
    }
};

export default modal;
