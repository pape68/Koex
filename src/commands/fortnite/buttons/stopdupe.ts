import axios from 'axios';
import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    interaction.deferReply({
        ephemeral: true
    });

    const { user } = interaction;

    const { data: current } = await client.supabase
        .from('fortnite')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const baseInstace = {
        baseURL: 'https://fortnite-public-service-prod11.ol.epicgames.com',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${current.access_token}`
        }
    };

    const queryInstance = axios.create({
        ...baseInstace,
        params: {
            profileId: 'outpost0'
        }
    });

    await queryInstance
        .post(`/fortnite/api/game/v2/profile/${current.account_id}/client/QueryProfile`, {})
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
                    `/fortnite/api/game/v2/profile/${current.account_id}/client/StorageTransfer`,
                    {
                        transferOperations
                    }
                )
                .catch((err) => {
                    console.log(err);
                    return interaction.editReply(
                        `Stopping dupe failed, make sure you have 5 free inventory slots and try again.`
                    );
                })
                .finally(() => {
                    if (interaction.replied) return;
                    return interaction.editReply(`Dupe stopped!`);
                });
        });
};

execute.options = {
    label: 'Stop Dupe',
    style: ButtonStyle.Secondary,
    customId: 'stopdupe',
    type: ComponentType.Button
};

export default execute;
