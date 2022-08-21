import { ChatInputCommandInteraction } from 'discord.js';

import { Accounts, AuthData, SlotName } from '../../types/supabase';
import supabase from '../functions/supabase';

import createEmbed from '../functions/createEmbed';
import defaultResponses from '../helpers/defaultResponses';
import createOperationRequest from '../../api/mcp/createOperationRequest';
import { FortniteItem } from '../../api/types';
import { ComponentInteraction } from '../../interfaces/Component';

interface Overrides {
    auth?: AuthData;
    userId?: string;
}

const toggleDupe = async (
    enable: boolean,
    interaction?: ChatInputCommandInteraction | ComponentInteraction,
    overrides?: Overrides
) => {
    if (!interaction && !overrides) {
        console.error(new Error('Invalid function parameters.'));
    }

    if (!interaction?.deferred && !interaction?.replied) await interaction?.deferReply();

    const { data: account, error } = await supabase
        .from<Accounts>('accounts_test')
        .select('*')
        .match({ user_id: overrides?.userId ?? interaction?.user.id })
        .maybeSingle();

    if (error) return interaction?.editReply(defaultResponses.authError);

    if (!account) return interaction?.editReply(defaultResponses.loggedOut);

    const auth: AuthData | null = account[('slot_' + account.active_slot) as SlotName];

    if (!auth) return interaction?.editReply(defaultResponses.loggedOut);

    const queryProfileRes = await createOperationRequest(
        overrides?.auth ?? auth,
        enable ? 'theater0' : 'outpost0',
        'QueryProfile'
    );

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

        if (storageTransferRes.error.response) {
            switch (storageTransferRes.error.response.data.numericErrorCode) {
                case 12821:
                    interaction?.editReply({
                        embeds: [
                            createEmbed(
                                'error',
                                "Profile locked, make sure you're in the lobby, wait a few minutes, and try again."
                            )
                        ]
                    });
                    break;
                case 16098:
                    interaction?.editReply({
                        embeds: [
                            createEmbed('error', `You need at least 4 free ${enable ? 'storage' : 'inventory'} slots.`)
                        ]
                    });
                    break;
                default:
                    interaction?.editReply(defaultResponse);
                    break;
            }
        }
        return interaction?.editReply(defaultResponse);
    }

    return interaction?.editReply({
        embeds: [createEmbed('success', `Successfully ${enable ? 'started' : 'stopped'} the dupe.`)]
    });
};

export default toggleDupe;
