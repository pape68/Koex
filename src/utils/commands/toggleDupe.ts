import { ButtonInteraction } from 'discord.js';
import _ from 'lodash';

import { FortniteItem, QueryProfileResult } from '../constants/interfaces';
import createEmbed from '../functions/createEmbed';
import getUserData from '../functions/getUserData';
import operationRequest from '../functions/operationRequest';

const toggleDupe = async (interaction: ButtonInteraction, enable: boolean) => {
    await interaction.deferReply();

    const user = await getUserData(interaction.user.id, interaction, true);

    if (_.isEmpty(user))
        return interaction.editReply({
            embeds: [createEmbed('error', 'You are not logged in.')]
        });

    const query = await operationRequest<QueryProfileResult>(user, 'QueryProfile', enable ? 'theater0' : 'outpost0');

    if (!query.data || query.error)
        return interaction.editReply({
            embeds: [createEmbed('error', 'Failed to toggle dupe.')]
        });

    const itemGuids = [
        'Weapon:buildingitemdata_wall',
        'Weapon:buildingitemdata_floor',
        'Weapon:buildingitemdata_stair_w',
        'Weapon:buildingitemdata_roofs'
    ];

    const profileItems: FortniteItem[] = query.data.profileChanges[0].profile.items;
    const transferData = new Map(Object.entries(profileItems).map(([k, v]) => [v.templateId, k]));

    const transferOperations = itemGuids
        .filter((v) => transferData.has(v))
        .map((v) => ({
            itemId: transferData.get(v),
            quantity: 1,
            toStorage: enable ? 'True' : 'False',
            newItemIdHint: 'molleja'
        }));

    const transfer = await operationRequest(user, 'StorageTransfer', 'theater0', { transferOperations });

    if (!transfer.data || transfer.error) {
        const defaultResponse = {
            embeds: [
                createEmbed(
                    'error',
                    `An error occurred while ${enable ? 'starting' : 'stopping'} the dupe.`
                )
            ]
        };

        if (transfer.error.response) {
            switch (transfer.error.response.data.numericErrorCode) {
                case 12821:
                    interaction.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                "Profile locked, make sure you're in the lobby, wait a few minutes, and try again."
                            )
                        ]
                    });
                    break;
                case 16098:
                    interaction.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                `You need at least 4 free ${enable ? 'storage' : 'inventory'} slots.`
                            )
                        ]
                    });
                    break;
                default:
                    interaction.editReply(defaultResponse);
                    break;
            }

            return interaction.editReply(defaultResponse);
        }
    }
    
    return interaction.editReply({
        embeds: [createEmbed('success', `Successfully ${enable ? 'started' : 'stopped'} the dupe.`)]
    });
};

export default toggleDupe;
