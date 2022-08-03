import axios from 'axios';
import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    interaction.deferReply({
        ephemeral: true
    });

    const { user } = interaction;

    const { data } = await client.supabase
        .from('fortnite')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const params = {
        profileId: 'theater0'
    };

    const instance = axios.create({
        baseURL: 'https://fortnite-public-service-prod11.ol.epicgames.com',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${data.access_token}`
        },
        params
    });

    await instance
        .post(`/fortnite/api/game/v2/profile/${data.account_id}/client/QueryProfile`, {})
        .then(async (res) => {
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
                    toStorage: 'True',
                    newItemIdHint: 'molleja'
                }));

            await instance
                .post(`/fortnite/api/game/v2/profile/${data.account_id}/client/StorageTransfer`, {
                    transferOperations
                })
                .catch((err) => {
                    console.log(err);
                    return interaction.editReply(
                        `Dupe failed, make sure you have 5 free storage slots and try again.`
                    );
                })
                .finally(() => {
                    if (interaction.replied) return;
                    return interaction.editReply(`Dupe successful!`);
                });
        });
};

execute.options = {
    label: 'Start Dupe',
    style: ButtonStyle.Success,
    customId: 'startdupe',
    type: ComponentType.Button
};

export default execute;
