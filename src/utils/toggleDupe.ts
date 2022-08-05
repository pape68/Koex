import axios from 'axios';
import { ButtonInteraction } from 'discord.js';

import Bot from '../structures/Bot';
import { Item } from '../types/fortnite';

const toggleDupe = async (client: Bot, interaction: ButtonInteraction, starting: boolean) => {
    await interaction.deferReply({ ephemeral: true });

    const { data } = await client.supabase
        .from('fortnite')
        .select('*')
        .eq('user_id', interaction.user.id)
        .single();

    if (!data) return interaction.editReply("You can't use this while not logged in.");

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
            profileId: starting ? 'theater0' : 'outpost0'
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
                    toStorage: starting ? 'True' : 'False',
                    newItemIdHint: 'molleja'
                }));

            await transferInstance
                .post(`/fortnite/api/game/v2/profile/${data.account_id}/client/StorageTransfer`, {
                    transferOperations
                })
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
                                    `Not enough ${
                                        starting ? 'storage' : 'backpack'
                                    } space. Please have at least 4 slots free.`
                                );
                                break;
                            default:
                                interaction.editReply(
                                    `An error occurred while transferring items to ${
                                        starting ? 'storage' : 'backpack'
                                    }.`
                                );
                                break;
                        }
                    }
                })
                .finally(() => {
                    if (interaction.replied) return;
                    return interaction.editReply(starting ? 'Dupe successful.' : 'Dupe stopped.');
                });
        })
        .catch((err) => {
            client.logger.error(err);
            return interaction.editReply('An unexpected error occurred. Please try again.');
        });
};

export default toggleDupe;
