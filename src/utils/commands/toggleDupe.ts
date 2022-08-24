import { ChatInputCommandInteraction } from 'discord.js';

import { AuthData, DupeBlacklist } from '../../types/supabase';

import createOperationRequest from '../../api/mcp/createOperationRequest';
import { FortniteItem } from '../../api/types';
import { ComponentInteraction } from '../../interfaces/Component';
import defaultResponses from '../helpers/defaultResponses';
import createEmbed from './createEmbed';
import refreshAuthData from './refreshAuthData';
import supabase from '../functions/supabase';

interface Overrides {
    auth: AuthData;
    userId: string;
}

const toggleDupe = async (
    enable: boolean,
    interaction?: ChatInputCommandInteraction | ComponentInteraction,
    overrides?: Overrides
) => {
    if (!interaction && !overrides) {
        throw new Error('Invalid function parameters.');
    }

    if (!interaction?.deferred && !interaction?.replied) await interaction?.deferReply({ ephemeral: true });

    const userId = (overrides?.userId ?? interaction?.user.id)!;

    const blacklist = await supabase
        .from<DupeBlacklist>('dupe_blacklist')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (blacklist.data) {
        interaction?.editReply({
            embeds: [createEmbed('error', 'You are blacklisted from duping.')]
        });
        throw new Error(`User '${userId}' is blacklisted.`);
    }

    const auth = await refreshAuthData(userId);

    if (!auth) return interaction?.editReply(defaultResponses.loggedOut);

    const queryProfileRes = await createOperationRequest(auth, enable ? 'theater0' : 'outpost0', 'QueryProfile');

    if (!queryProfileRes.data || queryProfileRes.error)
        return interaction?.editReply({
            embeds: [createEmbed('error', 'Failed to toggle dupe.')]
        });

    const itemGuids = [
        'Weapon:buildingitemdata_wall',
        'Weapon:buildingitemdata_floor',
        'Weapon:buildingitemdata_stair_w',
        'Weapon:buildingitemdata_roofs'
    ];

    const profileItems: FortniteItem[] = queryProfileRes.data.profileChanges[0].profile.items;
    const transferData = new Map(Object.entries(profileItems).map(([k, v]) => [v.templateId, k]));

    const transferOperations = itemGuids
        .filter((v) => transferData.has(v))
        .map((v) => ({
            itemId: transferData.get(v),
            quantity: 1,
            toStorage: enable ? 'True' : 'False',
            newItemIdHint: 'molleja'
        }));

    const storageTransferRes = await createOperationRequest(overrides?.auth ?? auth, 'theater0', 'StorageTransfer', {
        transferOperations
    });

    if (!storageTransferRes.data || storageTransferRes.error) {
        const defaultResponse = {
            embeds: [createEmbed('error', `An error occurred while ${enable ? 'starting' : 'stopping'} the dupe.`)]
        };

        switch (storageTransferRes.error.numericErrorCode) {
            case 12821:
                return interaction?.editReply({
                    embeds: [
                        createEmbed(
                            'error',
                            "Profile locked, make sure you're in the lobby, wait a few minutes, and try again."
                        )
                    ]
                });
            case 16098:
                return interaction?.editReply({
                    embeds: [
                        createEmbed('error', `You need at least 4 free ${enable ? 'storage' : 'inventory'} slots.`)
                    ]
                });
            default:
                return interaction?.editReply(defaultResponse);
        }
    }

    return interaction?.editReply({
        embeds: [createEmbed('success', `Successfully ${enable ? 'started' : 'stopped'} the dupe.`)]
    });
};

export default toggleDupe;
