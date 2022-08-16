export type Created = {
    location: string;
    ipAddress: string;
    dateTime: string;
};

export type DeviceAuth = {
    accountId: string;
    deviceId: string;
    secret: string;
    userAgent?: string;
    created?: Created;
};

export type StringSignature = {
    [key: string]: any;
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
} & StringSignature;

export type AuthData = UserData & DeviceAuth;

export type Accounts = {
    user_id: string;
    slot_0?: AuthData;
    slot_1?: AuthData;
    slot_2?: AuthData;
    slot_3?: AuthData;
    slot_4?: AuthData;
    active_slot?: number;
} & StringSignature;
