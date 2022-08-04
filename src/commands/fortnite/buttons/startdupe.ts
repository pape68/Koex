import axios from 'axios';
import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

import { Button } from '../../../interfaces/Button';
import Bot from '../../../structures/Bot';

const execute: Button = async (client: Bot, interaction: ButtonInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const { data } = await client.supabase
        .from('fortnite')
        .select('*')
        .eq('user_id', interaction.user.id)
        .single();

    if (!data) return interaction.reply("You can't use this while not logged in.");

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
                        `Dupe failed, make sure you have 5 free storage slots, wait 2-3 minutes, and try again.`
                    );
                })
                .finally(() => {
                    if (interaction.replied) return;
                    return interaction.editReply(`Dupe successful!`);
                });
        })
        .catch((err) => {
            client.logger.error(err);
            return interaction.editReply(`Dupe failed for magical reasons.`);
        });

    if (!data.no_reminders) {
        setTimeout(() => {
            interaction.followUp({
                content: `Make sure to press "Stop Dupe" when you're done!`,
                ephemeral: true
            });
        }, 10 * 60 * 1000);
    }
};

execute.options = {
    label: 'Start Dupe',
    style: ButtonStyle.Success,
    customId: 'startDupe',
    type: ComponentType.Button
};

export default execute;
