import composeMcp from '../../api/mcp/composeMcp';
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

    await composeMcp<CampaignProfileData>(auth, 'theater0', 'StorageTransfer', {
        transferOperations
    });
};

export default toggleDupe;
