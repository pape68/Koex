export type Accounts = {
    user_id: string;
    auths: Auth[];
    active_account_id: string | null;
};

export type Auth = {
    displayName: string;
    accessToken?: string;
} & DeviceAuth;

export type AutoDaily = {
    user_id: string;
};

export type DeviceAuth = {
    accountId: string;
    deviceId: string;
    secret: string;
};

export type DupeWhitelist = {
    user_id: string;
};
