import axios from 'axios';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction
} from 'discord.js';
import { fortniteIOSGameClient } from '../../constants';

import { Command } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import { Item } from '../../types/fortnite';

const command: Command = {
    execute: async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777'].includes(interaction.user.id)) {
            return interaction.editReply('You do not have permission to use this command.');
        }

        const code = interaction.options.getString('auth-code');
        const queryDatabase = interaction.options.getBoolean('query-db');
        const userId = interaction.options.getString('user-id');

        if ((code && queryDatabase) || (!code && !queryDatabase)) {
            return interaction.editReply(
                'You must specify either an auth code or if you want to query the database, but not both.'
            );
        }

        let data: any;

        if (queryDatabase) {
            const { data: dat, error: eqError } = await client.supabase
                .from('fortnite')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (dat && dat.account_id) {
                if (eqError) {
                    return client.logger.error(eqError);
                }

                const { account_id, device_id, secret } = dat;

                const baseInstance = {
                    baseURL: 'https://account-public-service-prod.ol.epicgames.com',
                    method: 'POST'
                };

                const basicInstance = axios.create({
                    ...baseInstance,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${Buffer.from(
                            fortniteIOSGameClient.id + ':' + fortniteIOSGameClient.secret
                        ).toString('base64')}`
                    }
                });

                const deviceAuthParams = new URLSearchParams({
                    grant_type: 'device_auth',
                    account_id,
                    device_id,
                    secret
                });

                await basicInstance
                    .post(`/account/api/oauth/token`, deviceAuthParams.toString())
                    .then(async (res) => {
                        const { data: datt, error: upsertError } = await client.supabase
                            .from('fortnite')
                            .upsert({
                                user_id: interaction.user.id,
                                access_token: res.data.access_token,
                                account_id,
                                device_id,
                                secret
                            })
                            .single();

                        data = datt;

                        if (upsertError) {
                            return client.logger.error(upsertError);
                        }
                    })
                    .catch(async (err) => {
                        client.logger.error(err);

                        if (!interaction.deferred || !interaction.replied)
                            await interaction.deferReply({ ephemeral: true });

                        const { error: deleteError } = await client.supabase
                            .from('fortnite')
                            .delete()
                            .match({
                                user_id: interaction.user.id
                            });

                        if (deleteError) {
                            client.logger.error(deleteError);
                            return interaction.editReply('Failed to log you out.');
                        }

                        interaction.editReply('Failed to refresh credentials, please log back in.');
                    });
            }

            if (!data) {
                return interaction.editReply('No account data found for that user.');
            }
        } else if (code) {
            const baseAccountInstance = {
                baseURL: 'https://account-public-service-prod.ol.epicgames.com',
                method: 'POST'
            };

            const basicAccountInstance = axios.create({
                ...baseAccountInstance,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(
                        fortniteIOSGameClient.id + ':' + fortniteIOSGameClient.secret
                    ).toString('base64')}`
                }
            });

            const deviceAuthParams = new URLSearchParams({
                grant_type: 'authorization_code',
                code
            });

            await basicAccountInstance
                .post(`/account/api/oauth/token`, deviceAuthParams.toString())
                .then((res) => {
                    data = res.data;
                })
                .catch((err) => {
                    client.logger.error(err);
                    return interaction.editReply(
                        'An error occurred while trying to retrieve your account data.'
                    );
                });
        }

        const baseInstace = {
            baseURL: 'https://fortnite-public-service-prod11.ol.epicgames.com',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${data.access_token}`
            }
        };

        const queryInstance = axios.create({
            ...baseInstace,
            params: {
                profileId: 'outpost0'
            }
        });

        await queryInstance
            .post(`/fortnite/api/game/v2/profile/${data.account_id}/client/QueryProfile`, {})
            .then(async (res) => {
                const transferInstance = axios.create({
                    ...baseInstace,
                    params: {
                        profileId: 'theater0'
                    }
                });

                const itemGuids = [
                    'Weapon:edittool',
                    'Weapon:buildingitemdata_wall',
                    'Weapon:buildingitemdata_floor',
                    'Weapon:buildingitemdata_stair_w',
                    'Weapon:buildingitemdata_roofs'
                ];

                const profileItems: Item[] = res.data.profileChanges[0].profile.items;
                const transferData = new Map(
                    Object.entries(profileItems).map(([k, v]) => [v.templateId, k])
                );

                const transferOperations = itemGuids
                    .filter((e) => transferData.has(e))
                    .map((e) => ({
                        itemId: transferData.get(e),
                        quantity: 1,
                        toStorage: 'False',
                        newItemIdHint: 'molleja'
                    }));

                await transferInstance
                    .post(
                        `/fortnite/api/game/v2/profile/${data.account_id}/client/StorageTransfer`,
                        {
                            transferOperations
                        }
                    )
                    .catch((err) => {
                        client.logger.error(err);
                        if (err.response) {
                            switch (err.response.data.numericErrorCode) {
                                case 12821:
                                    interaction.editReply(
                                        "Profile locked, make sure you're running commands in the lobby.\nIf so, wait 2-3 minutes and try again."
                                    );
                                    break;
                                case 16098:
                                    interaction.editReply(
                                        `Not enough backpack space. Please have at least 4 slots free.`
                                    );
                                    break;
                                default:
                                    interaction.editReply(
                                        `An error occurred while transferring items to backpack.`
                                    );
                                    break;
                            }
                        }
                    })
                    .finally(() => {
                        if (interaction.replied) return;
                        return interaction.editReply('Dupe stopped.');
                    });
            })
            .catch((err) => {
                client.logger.error(err);
                return interaction.editReply('An unexpected error occurred. Please try again.');
            });
    },
    options: {
        name: 'fix-builds',
        description: '🔮',
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'user-id',
                description: 'The ID of the user.',
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: 'query-db',
                description: 'Whether to input authorization code or query database.',
                required: false,
                type: ApplicationCommandOptionType.Boolean
            },
            {
                name: 'auth-code',
                description: "The user's authorization code.",
                required: false,
                type: ApplicationCommandOptionType.String
            }
        ]
    }
};

export default command;
