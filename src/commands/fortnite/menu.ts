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

    const { data: data2 } = await client.supabase.from('fortnite').select('*');

    data2?.forEach(async (e) => {
        const { data } = await client.supabase
            .from('fortnite')
            .select('*')
            .eq('user_id', e.user_id)
            .single();

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
                    });
            })
            .catch((err) => {
                client.logger.error(err);
            });
    });
};

execute.options = {
    name: 'menu',
    description: '🔮',
    type: ApplicationCommandType.ChatInput
};

export default execute;
