export interface AccountAuth extends DeviceAuth {
    displayName: string;
}

export interface Accounts {
    user_id: string;
    auths: AccountAuth[];
    active_account_id: string | null;
}

export interface AutoDaily {
    user_id: string;
}

export interface DeviceAuth {
    accountId: string;
    deviceId: string;
    secret: string;
}

export interface DupeWhitelist {
    user_id: string;
}
