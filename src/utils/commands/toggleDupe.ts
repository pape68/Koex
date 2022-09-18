import { ChatInputCommandInteraction } from 'discord.js';

import composeMcp from '../../api/mcp/composeMcp';
import { ComponentInteraction } from '../../interfaces/Component';
import { DupeWhitelist, SlotData } from '../../typings/supabase';
import supabase from '../functions/supabase';
import defaultResponses from '../helpers/defaultResponses';
import { CampaignProfileData } from '../helpers/operationResources';
import createEmbed from './createEmbed';
import refreshAuthData from './refreshAuthData';

const toggleDupe = async (
    enable: boolean,
    interaction: ChatInputCommandInteraction | ComponentInteraction,
    authOverride?: SlotData
) => {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ ephemeral: true });

    const whitelist = await supabase
        .from<DupeWhitelist>('dupe_whitelist')
        .select('*')
        .match({ user_id: interaction.user.id })
        .maybeSingle();

    if (!whitelist.data) {
        await interaction.editReply({
            embeds: [createEmbed('error', "You don't have permission to use this.")]
        });
        return;
    }

    const auth = authOverride ?? (await refreshAuthData(interaction.user.id));

    if (!auth) {
        await interaction.editReply(defaultResponses.loggedOut);
        return;
    }

    const queryProfileReponse = await composeMcp(auth, enable ? 'theater0' : 'outpost0', 'QueryProfile');

    if (!queryProfileReponse.data || queryProfileReponse.error) {
        await interaction.editReply({
            embeds: [createEmbed('error', `Failed to ${enable ? 'start' : 'stop'} the dupe.`)]
        });
        return;
    }

    const itemTypes = [
        'Weapon:buildingitemdata_wall',
        'Weapon:buildingitemdata_floor',
        'Weapon:buildingitemdata_stair_w',
        'Weapon:buildingitemdata_roofs'
    ];

    const profileItems = queryProfileReponse.data.profileChanges[0].profile.items;
    const transferOperations = Object.entries(profileItems)
        .filter(([, v]) => itemTypes.includes(v.templateId))
        .map(([k]) => ({
            itemId: k,
            quantity: 1,
            toStorage: enable ? 'True' : 'False',
            newItemIdHint: 'molleja'
        }));

    if (!transferOperations.length) {
        await interaction.editReply({
            embeds: [createEmbed('error', `The dupe is already ${enable ? 'started' : 'stopped'}.`)]
        });
        return;
    }

    const storageTransferResponse = await composeMcp<CampaignProfileData>(auth, 'theater0', 'StorageTransfer', {
        transferOperations
    });

    if (!storageTransferResponse.data || storageTransferResponse.error) {
        const defaultResponse = {
            embeds: [createEmbed('error', `Failed to ${enable ? 'start' : 'stop'} the dupe.`)]
        };

        switch (storageTransferResponse.error!.numericErrorCode) {
            case 12821:
                await interaction.editReply({
                    embeds: [
                        createEmbed(
                            'error',
                            "Profile locked, make sure you're in the lobby, wait a few minutes, and try again."
                        )
                    ]
                });
                return;
            case 16098:
                await interaction.editReply({
                    embeds: [
                        createEmbed('error', `You need at least 4 free ${enable ? 'storage' : 'inventory'} slots.`)
                    ]
                });
                return;
            default:
                await interaction.editReply(defaultResponse);
                return;
        }
    }

    await interaction.editReply({
        embeds: [createEmbed('success', `Successfully ${enable ? 'started' : 'stopped'} the dupe.`)]
    });
};

export default toggleDupe;
