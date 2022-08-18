export interface AvatarResponse {
    accountId: string;
    namespace: string;
    avatarId:  string;
}

export interface FortniteItem {
    itemId: string;
    templateId: string;
    attributes: any;
    quantity: number;
}

export interface QueryProfileResponse {
    profileRevision: number;
    profileId: string;
    profileChangesBaseRevision: number;
    profileChanges: any[];
}