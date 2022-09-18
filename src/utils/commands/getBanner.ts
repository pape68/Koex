import composeMcp from '../../api/mcp/composeMcp';
import { PublicProfileData } from '../helpers/operationResources';
import refreshAuthData from './refreshAuthData';

const getBanner = async (userId: string) => {
    const auth = await refreshAuthData(userId);

    if (!auth) return null;

    let bannerId = 'standardbanner1';

    const profile = await composeMcp<PublicProfileData>(auth, 'common_public', 'QueryPublicProfile');

    if (!profile.data || profile.error) return null;

    const data = profile.data.profileChanges[0].profile.stats.attributes;

    bannerId = data.banner_icon;

    return `https://fortnite-api.com/images/banners/${bannerId}/smallicon.png`;
};

export default getBanner;
