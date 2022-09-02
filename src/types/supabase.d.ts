export type DeviceAuth = {
    accountId: string;
    deviceId: string;
    secret: string;
};

export type UserData = {
    access_token: string;
    expires_in: number;
    expires_at: string;
    token_type: string;
    refresh_token: string;
    refresh_expires: number;
    refresh_expires_at: string;
    account_id: string;
    client_id: string;
    internal_client: boolean;
    client_service: string;
    scope: any[];
    displayName: string;
    app: string;
    in_app_id: string;
    device_id?: string;
};

export type AuthData = DeviceAuth & {
    accessToken: string;
    displayName: string;
};

type SlotName = 'slot_0' | 'slot_1' | 'slot_2' | 'slot_3' | 'slot_4';

export type Accounts = {
    user_id: string;
    slot_0: AuthData | null;
    slot_1: AuthData | null;
    slot_2: AuthData | null;
    slot_3: AuthData | null;
    slot_4: AuthData | null;
    active_slot: number | 0;
};

export type DupeWhitelist = {
    user_id: string;
};
