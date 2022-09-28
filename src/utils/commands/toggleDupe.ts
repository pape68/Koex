import composeMcp from '../../api/mcp/composeMcp';
import EpicGamesAPIError from '../errors/EpicGamesAPIError';
import { CampaignProfileData } from '../helpers/operationResources';
import createAuthData, { BearerAuth } from './createAuthData';

const toggleDupe = async (enable: boolean, userId: string, authOverride?: BearerAuth) => {
    const auth = authOverride ?? (await createAuthData(userId));

    if (!auth) throw new Error('Failed to create authorization data');

    const targetProfile = await composeMcp(auth, enable ? 'theater0' : 'outpost0', 'QueryProfile');

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
        await composeMcp<CampaignProfileData>(auth, 'theater0', 'StorageTransfer', {
            transferOperations
        });
    } catch (err) {
        console.log(err);
    }

    try {
        await composeMcp<CampaignProfileData>(auth, 'theater0', 'StorageTransfer', {
            transferOperations
        });
    } catch (err: any) {
        const error: EpicGamesAPIError = err;
        throw new Error(error.message);
    }
};

export default toggleDupe;
