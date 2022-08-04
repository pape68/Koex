import axios from 'axios';
import { ComponentType } from 'discord.js';
import { getAuthCodeButton, menuComponents } from '../constants';
import { Event } from '../interfaces/Event';
import Bot from '../structures/Bot';

const execute: Event = async (client: Bot) => {
    client.logger.info(`Logged in as ${client.user!.tag}!`);
    client.loadCommands();

    menuComponents.loggedIn.push(
        {
            type: ComponentType.ActionRow,
            components: [
                client.interactions.get('startDupe')!.options,
                client.interactions.get('stopDupe')!.options,
                client.interactions.get('logout')!.options
            ]
        },
        {
            type: ComponentType.ActionRow,
            components: [getAuthCodeButton, client.interactions.get('switchAccounts')!.options]
        },
        {
            type: ComponentType.ActionRow,
            components: [client.interactions.get('toggleReminder')!.options]
        }
    );
    menuComponents.loggedOut.push({
        type: ComponentType.ActionRow,
        components: [getAuthCodeButton, client.interactions.get('login')!.options]
    });

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

export default execute;
