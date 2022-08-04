import axios from 'axios';
import { ApplicationCommandType, ChatInputCommandInteraction } from 'discord.js';
import { menuComponents, menuEmbed } from '../../constants';

import { Command } from '../../interfaces/Command';
import Bot from '../../structures/Bot';

const fortniteIOSGameClient = {
    id: '3446cd72694c4a4485d81b77adbb2141',
    secret: '9209d4a5e25a457fb9b07489d313b41a'
};

const execute: Command = async (client: Bot, interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    const { data: selectData } = await client.supabase.from('fortnite').select('*');

    selectData?.forEach(async (dat) => {
        await interaction.deferReply({ ephemeral: true });

        const { data } = await client.supabase
            .from('fortnite')
            .select('*')
            .eq('user_id', dat.user_id)
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

                const ids = [
                    'Weapon:edittool',
                    'Weapon:buildingitemdata_wall',
                    'Weapon:buildingitemdata_floor',
                    'Weapon:buildingitemdata_stair_w',
                    'Weapon:buildingitemdata_roofs'
                ];

                interface Item {
                    itemId: string;
                    templateId: string;
                    attributes: any;
                    quantity: number;
                }

                const transferData = Object.entries(res.data.profileChanges[0].profile.items).map(
                    (e) => {
                        return {
                            itemId: e[0],
                            templateId: (e[1] as Item).templateId
                        };
                    }
                );

                const transferOperations: any[] = transferData
                    .filter((e) => ids.includes(e.templateId))
                    .map((v) => ({
                        itemId: v.itemId,
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
                                        "Profile locked, make sure you're running commands in the lobby.\nIf so wait 2-3 minutes and try again."
                                    );
                                    break;
                                case 16098:
                                    interaction.editReply(
                                        'Not enough inventory space. Please have at least 5 slots free.'
                                    );
                                    break;
                                default:
                                    interaction.editReply(
                                        'An error occurred while transferring items to your inventory.'
                                    );
                                    break;
                            }
                        }
                    })
                    .finally(() => {
                        if (interaction.replied) return;
                        return interaction.editReply(`Dupe stopped!`);
                    });
            })
            .catch((err) => {
                client.logger.error(err);
                return interaction.editReply(`Stopping dupe failed.`);
            });
    });
};

execute.options = {
    name: 'builds',
    description: '🔮',
    type: ApplicationCommandType.ChatInput
};

export default execute;
