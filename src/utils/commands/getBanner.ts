import Jimp from 'jimp';

import composeMcp from '../../api/mcp/composeMcp';
import { CampaignProfileData } from '../helpers/operationResources';
import refreshAuthData from './refreshAuthData';

const getBanner = async (userId: string) => {
    const auth = await refreshAuthData(userId);

    if (!auth) return null;

    let bannerId = 'standardbanner1';

    const profile = await composeMcp<CampaignProfileData>(auth, 'campaign', 'QueryProfile');

    if (!profile.data || profile.error) return null;

    const items = profile.data.profileChanges[0].profile.items;

    bannerId = Object.values(items)
        .filter((v) => v.templateId.startsWith('CosmeticLocker:') && v)
        .map((v) => v.attributes.banner_icon_template)[0];

    const url = `https://fortnite-api.com/images/banners/${bannerId}/smallicon.png`;

    const image = await Jimp.read(url);

    // Remove Black Background
    const colorDistance = (v: number[]) => Math.sqrt(Math.pow(0 - v[0], 2) + Math.pow(255 - v[1], 2));
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (_x, _y, idx) => {
        const currentRed = [image.bitmap.data[idx], image.bitmap.data[idx + 3]];
        if (colorDistance(currentRed) <= 50) image.bitmap.data[idx + 3] = 0;
    });

    return await image.getBufferAsync(Jimp.MIME_PNG);
};

export default getBanner;
