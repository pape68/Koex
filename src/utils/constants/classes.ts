import { EpicServices } from './enums';

export class Endpoints {
    oauth = `${EpicServices.ACCOUNT_SERVICE}/account/api/oauth`;

    oauthTokenCreate = `${this.oauth}/token`;
    oauthTokenVerify = `${this.oauth}/verify`;
    oauthTokenDelete = `${this.oauth}/sessions/kill`;
    oauthTokenDeleteMultiple = `${this.oauth}/sessions/kill`;
    oauthExchange = `${this.oauth}/exchange`;
    oauthDeviceAuth = `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account`;
    oauthDeviceCode = `${this.oauth}/deviceAuthorization`;
    calderaToken = `${EpicServices.CALDERA_SERVICE}/caldera/api/v1/launcher/racp`;

    accountMultiple = `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account`;
    accountDisplayName = `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account/displayName`;
    accountId = `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account`;
    accountEmail = `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account/email`;
    userSearch = `${EpicServices.USER_SEARCH_SERVICE}/api/v1/search`;
    accountAvatars = `${EpicServices.AVATAR_SERVICE}/v1/avatar/fortnite/ids`;

    brStats = `${EpicServices.STATS_SERVICE}/statsproxy/api/statsv2`;
    mcp = `${EpicServices.FORTNITE_SERVICE}/fortnite/api/game/v2/profile`;
    brInventory = `${EpicServices.FORTNITE_SERVICE}/fortnite/api/game/v2/br-inventory/account`;

    fortniteStatus = `${EpicServices.LIGHTSWITCH_SERVICE}/lightswitch/api/service/bulk/status?serviceId=Fortnite`;
    fortniteCatalog = `${EpicServices.FORTNITE_SERVICE}/fortnite/api/storefront/v2/catalog`;
    eventFlags = `${EpicServices.FORTNITE_SERVICE}/fortnite/api/calendar/v1/timeline`;

    fortniteParty = `${EpicServices.PARTY_SERVICE}/party/api/v1/Fortnite`;
    
    friends = `${EpicServices.FORTNITE_SERVICE}/friends/api/v1`;
    addFriend = `${EpicServices.FORTNITE_SERVICE}/friends/api/public/friends`;
    removeFriend = `${EpicServices.FORTNITE_SERVICE}/friends/api/v1`;
    blockFriend = `${EpicServices.FORTNITE_SERVICE}/friends/api/public/blocklist`;
}
