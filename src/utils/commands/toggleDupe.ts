import composeMcp from '../../api/mcp/composeMcp';
import { SlotData } from '../../typings/supabase';
import EpicGamesAPIError from '../errors/EpicGamesAPIError';
import { CampaignProfileData } from '../helpers/operationResources';
import refreshAuthData from './refreshAuthData';

const toggleDupe = async (enable: boolean, userId: string, authOverride?: SlotData | null) => {
    const auth =
        authOverride ??
        (await refreshAuthData(userId, undefined, async (msg) => {
            throw new Error(msg);
        }));

    const targetProfile = await composeMcp(auth!, enable ? 'theater0' : 'outpost0', 'QueryProfile');

    const itemTypes = [
        'Weapon:buildingitemdata_wall',
        'Weapon:buildingitemdata_floor',
        'Weapon:buildingitemdata_stair_w',
        'Weapon:buildingitemdata_roofs'
    ];

    const profileItems = targetProfile.profileChanges[0].profile.items;
    const transferOperations = Object.entries(profileItems)
        .filter(([, v]) => itemTypes.includes(v.templateId))
        .map(([k]) => ({
            itemId: k,
            quantity: 1,
            toStorage: enable ? 'True' : 'False',
            newItemIdHint: 'molleja'
        }));

    if (!transferOperations.length) {
        throw new Error(`Dupe is already ${enable ? 'enabled' : 'disabled'}`);
    }

    try {
        await composeMcp<CampaignProfileData>(auth!, 'theater0', 'StorageTransfer', {
            transferOperations
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await composeMcp<CampaignProfileData>(auth!, 'theater0', 'StorageTransfer', {
            transferOperations
        });
    } catch (err: any) {
        const error: EpicGamesAPIError = err;
        throw new Error(error.message);
    }
};

export default toggleDupe;
