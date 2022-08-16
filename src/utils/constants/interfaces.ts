export interface FortniteItem {
    itemId: string;
    templateId: string;
    attributes: any;
    quantity: number;
}

export interface QueryProfileResult {
    profileRevision: number;
    profileId: string;
    profileChangesBaseRevision: number;
    profileChanges: any[];
}