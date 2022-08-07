import axios from 'axios';
import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';
import { setTimeout as wait } from 'timers/promises';

import { Button } from '../../../interfaces/Button';
import { ExtendedClient } from '../../../interfaces/ExtendedClient';
import { Item } from '../../../types/fortnite';

const button: Button = {
    execute: async (client: ExtendedClient, interaction: ButtonInteraction) => {
        await interaction.deferReply({ ephemeral: true });

        const { data: accountData } = await client.supabase
            .from('fortnite')
            .select('*')
            .eq('user_id', interaction.user.id)
            .single();

        if (!accountData) return interaction.editReply("You can't use this while not logged in.");

        const accessToken = accountData.access_token;
        const accountId = accountData.account_id;

        const partyInstance = axios.create({
            baseURL: 'https://party-service-prod.ol.epicgames.com',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${accessToken}`
            }
        });

        const { data: partyData } = await partyInstance.get(
            `/party/api/v1/Fortnite/user/${accountId}`
        );

        const parties = partyData.current.length;

        if (!parties || (parties && partyData.current[0].members.length === 1)) {
            return interaction.editReply(
                "Failed to find your current party, make sure you're in a party with your host."
            );
        }

        const partyId = partyData.current[0].id;

        interaction.editReply('You have 30 seconds to drop your items.');
        await wait(30 * 1000);

        const baseFortniteInstance = {
            baseURL: 'https://fortnite-public-service-prod11.ol.epicgames.com',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${accountData.access_token}`
            }
        };

        const queryInstance = axios.create({
            ...baseFortniteInstance,
            params: {
                profileId: 'theater0'
            }
        });

        await queryInstance
            .post(`/fortnite/api/game/v2/profile/${accountData.account_id}/client/QueryProfile`, {})
            .then(async (res) => {
                const transferInstance = axios.create({
                    ...baseFortniteInstance,
                    params: {
                        profileId: 'theater0'
                    }
                });

                const profileItems: Item[] = res.data.profileChanges[0].profile.items;
                const transferData = new Map(
                    Object.entries(profileItems).map(([k, v]) => [v.templateId, k])
                );

                const transferOperations = [
                    {
                        itemId: [...transferData][0][1],
                        quantity: 1,
                        toStorage: 'True',
                        newItemIdHint: 'molleja'
                    }
                ];

                await transferInstance
                    .post(
                        `/fortnite/api/game/v2/profile/${accountData.account_id}/client/StorageTransfer`,
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
                                        `Not enough storage space. Please have at least 4 slots free.`
                                    );
                                    break;
                                default:
                                    interaction.editReply(
                                        `An error occurred while transferring items to storage.`
                                    );
                                    break;
                            }
                        }
                    })
                    .finally(() => {
                        if (interaction.replied) return;
                        return interaction.editReply('Dupe successful.');
                    });
            })
            .catch((err) => {
                client.logger.error(err);
                return interaction.editReply('An unexpected error occurred. Please try again.');
            });

        partyInstance.delete(`/party/api/v1/Fortnite/parties/${partyId}/members/${accountId}`);

        return interaction.editReply(
            "Dupe attempted! You should've been kicked from the match, disconnect your Wi-Fi immediately."
        );
    },
    options: {
        label: 'Jules Dupe',
        style: ButtonStyle.Primary,
        customId: 'julesDupe',
        type: ComponentType.Button
    }
};

export default button;
