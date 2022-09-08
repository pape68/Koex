import { ChatInputCommandInteraction, Client } from 'discord.js';

import { DupeWhitelist, SlotData } from '../../types/supabase';
import createOperationRequest from '../../api/mcp/createOperationRequest';
import { FortniteItem } from '../../api/types';
import { ComponentInteraction } from '../../interfaces/Component';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import defaultResponses from '../helpers/defaultResponses';
import createEmbed from './createEmbed';
import refreshAuthData from './refreshAuthData';
import supabase from '../functions/supabase';

interface Overrides {
    auth: SlotData;
    userId: string;
}

const toggleDupe = async (
    client: Client | ExtendedClient,
    enable: boolean,
    interaction?: ChatInputCommandInteraction | ComponentInteraction,
    overrides?: Overrides
) => {
    if (!interaction && !overrides) {
        throw new Error('Invalid function parameters.');
    }

    if (!interaction?.deferred && !interaction?.replied)
        await interaction?.deferReply({ ephemeral: true });

    const userId = (overrides?.userId ?? interaction?.user.id)!;

    const whitelist = await supabase
        .from<DupeWhitelist>('dupe_whitelist')
        .select('*')
        .match({ user_id: userId })
        .maybeSingle();

    if (!whitelist.data) {
        interaction?.editReply({
            embeds: [createEmbed('error', "You don't have permission to use this.")]
        });
        throw new Error(`User '${userId}' not whitelisted.`);
    }

    const auth = await refreshAuthData(userId);

    if (!auth) {
        await interaction?.editReply(defaultResponses.loggedOut);
        return;
    }

    const queryProfileRes = await createOperationRequest(
        auth,
        enable ? 'theater0' : 'outpost0',
        'QueryProfile'
    );

    if (!queryProfileRes.data || queryProfileRes.error) {
        await interaction?.editReply({
            embeds: [createEmbed('error', `Failed to ${enable ? 'start' : 'stop'} the dupe.`)]
        });
        return;
    }

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

    if (!transferOperations.length) {
        await interaction?.editReply({
            embeds: [createEmbed('error', `The dupe is already ${enable ? 'started' : 'stopped'}.`)]
        });
        return;
    }

    const storageTransferRes = await createOperationRequest(
        overrides?.auth ?? auth,
        'theater0',
        'StorageTransfer',
        {
            transferOperations
        }
    );

    if (!storageTransferRes.data || storageTransferRes.error) {
        const defaultResponse = {
            embeds: [createEmbed('error', `Failed to ${enable ? 'start' : 'stop'} the dupe.`)]
        };

        switch (storageTransferRes.error.numericErrorCode) {
            case 12821:
                await interaction?.editReply({
                    embeds: [
                        createEmbed(
                            'error',
                            "Profile locked, make sure you're in the lobby, wait a few minutes, and try again."
                        )
                    ]
                });
                return;
            case 16098:
                await interaction?.editReply({
                    embeds: [
                        createEmbed(
                            'error',
                            `You need at least 4 free ${enable ? 'storage' : 'inventory'} slots.`
                        )
                    ]
                });
                return;
            default:
                await interaction?.editReply(defaultResponse);
                return;
        }
    }

    await interaction?.editReply({
        embeds: [createEmbed('success', `Successfully ${enable ? 'started' : 'stopped'} the dupe.`)]
    });
};

export default toggleDupe;
