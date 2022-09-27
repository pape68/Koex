export interface EpicApiErrorData {
    errorCode: string;
    errorMessage: string;
    messageVars: string[];
    numericErrorCode: number;
    originatingService: string;
    intent: string;
    message: string;
    errorStatus?: number;
}

export enum EpicServices {
    ACCOUNT_SERVICE = 'https://account-public-service-prod03.ol.epicgames.com',
    AVATAR_SERVICE = 'https://avatar-service-prod.identity.live.on.epicgames.com',
    CALDERA_SERVICE = 'https://caldera-service-prod.ecosec.on.epicgames.com',
    STATS_SERVICE = 'https://statsproxy-public-service-live.ol.epicgames.com',
    LIGHTSWITCH_SERVICE = 'https://lightswitch-public-service-prod06.ol.epicgames.com',
    FORTNITE_SERVICE = 'https://fortnite-public-service-prod11.ol.epicgames.com',
    PARTY_SERVICE = 'https://party-service-prod.ol.epicgames.com',
    USER_SEARCH_SERVICE = 'https://user-search-service-prod.ol.epicgames.com',
    FRIEND_SERVICE = 'https://friends-public-service-prod.ol.epicgames.com'
}

const oAuthEndpoint = `${EpicServices.ACCOUNT_SERVICE}/account/api/oauth`;

export const Endpoints = Object.freeze({
    // OAuth
    oAuth: oAuthEndpoint,
    oAuthTokenCreate: `${oAuthEndpoint}/token`,
    oAuthTokenVerify: `${oAuthEndpoint}/verify`,
    oAuthTokenDelete: `${oAuthEndpoint}/sessions/kill`,
    oAuthTokenExchange: `${oAuthEndpoint}/exchange`,
    oAuthDeviceAuth: `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account`,
    oAuthDeviceCode: `${oAuthEndpoint}/deviceAuthorization`,
    // Account
    accountMultiple: `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account`,
    accountdisplayName: `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account/displayName`,
    accountId: `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account`,
    accountEmail: `${EpicServices.ACCOUNT_SERVICE}/account/api/public/account/email`,
    userSearch: `${EpicServices.USER_SEARCH_SERVICE}/api/v1/search`,
    accountAvatars: `${EpicServices.AVATAR_SERVICE}/v1/avatar/fortnite/ids`,
    // Battle Royale
    brStats: `${EpicServices.STATS_SERVICE}/statsproxy/api/statsv2`,
    brInventory: `${EpicServices.FORTNITE_SERVICE}/fortnite/api/game/v2/br-inventory/account`,
    // Fortnite Data
    fortniteStatus: `${EpicServices.LIGHTSWITCH_SERVICE}/lightswitch/api/service/bulk/status?serviceId=Fortnite`,
    fortniteCatalog: `${EpicServices.FORTNITE_SERVICE}/fortnite/api/storefront/v2/catalog`,
    eventFlags: `${EpicServices.FORTNITE_SERVICE}/fortnite/api/calendar/v1/timeline`,
    mcp: `${EpicServices.FORTNITE_SERVICE}/fortnite/api/game/v2/profile`,
    // Fortnite Party
    fortniteParty: `${EpicServices.PARTY_SERVICE}/party/api/v1/Fortnite`,
    // Caldera
    caldera: `${EpicServices.CALDERA_SERVICE}/caldera/api/v1/launcher/racp`,
    // Friends
    friends: `${EpicServices.FRIEND_SERVICE}/friends/api/v1`,
    addFriend: `${EpicServices.FRIEND_SERVICE}/friends/api/v1`,
    removeFriend: `${EpicServices.FRIEND_SERVICE}/friends/api/v1`,
    blockFriend: `${EpicServices.FRIEND_SERVICE}/friends/api/public/blocklist`
});

export const AuthClients = Object.freeze({
    fortnitePCGameClient: btoa('ec684b8c687f479fadea3cb2ad83f5c6:e1f31c211f28413186262d37a13fc84d'),
    fortniteIOSGameClient: btoa('3446cd72694c4a4485d81b77adbb2141:9209d4a5e25a457fb9b07489d313b41a'),
    fortniteAndroidGameClient: btoa('3f69e56c7649492c8cc29f1af08a8a12:b51ee9cb12234f50a69efa67ef53812e'),
    fortniteSwitchGameClient: btoa('5229dcd3ac3845208b496649092f251b:e3bd2d3e-bf8c-4857-9e7d-f3d947d220c7'),
    fortniteCNGameClient: btoa('efe3cbb938804c74b20e109d0efc1548:6e31bdbae6a44f258474733db74f39ba'),
    launcherAppClient2: btoa('34a02cf8f4414e29b15921876da36f9a:daafbccc737745039dffe53d94fc76cf')
});

export enum GrantType {
    authorization_code,
    client_credentials,
    device_auth,
    device_code,
    exchange_code,
    external_auth,
    password,
    refresh_token,
    token_to_token
}

export interface GrantData {
    grant_type: keyof typeof GrantType;
    [key: string]: any;
}
