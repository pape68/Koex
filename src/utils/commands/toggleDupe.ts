import util from 'node:util';

import composeMcp from '../../api/mcp/composeMcp';
import { getWhitelistedUser } from '../functions/database';
import { CampaignProfileData } from '../helpers/operationResources';
import createAuthData from './createAuthData';

const toggleDupe = async (enable: boolean, userId: string, cb?: (msg: string) => void) => {
    const isWhitelisted = await getWhitelistedUser(userId);

    if (!isWhitelisted) throw new Error('(∩｀-´)⊃━☆ﾟ.*･｡ﾟ');

    const auth = await createAuthData(userId);

    if (!auth) {
        if (cb) await util.promisify(cb)('You have been logged out.');
        throw new Error('Failed to create authorization data');
    }

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
        if (cb) await util.promisify(cb)(`Dupe is already ${enable ? 'enabled' : 'disabled'}`);
        return;
    }

    await composeMcp<CampaignProfileData>(auth, 'theater0', 'StorageTransfer', {
        transferOperations
    });
};

export default toggleDupe;
