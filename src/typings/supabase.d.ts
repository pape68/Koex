export type AuthData = {
    accessToken: string;
    displayName: string;
};

export type DeviceAuth = {
    accountId: string;
    deviceId: string;
    secret: string;
};

export type SurvivorPresets = {
    slot_0: PresetData | null;
    slot_1: PresetData | null;
    slot_2: PresetData | null;
    slot_3: PresetData | null;
    slot_4: PresetData | null;
};

export type SlotData = AuthData &
    DeviceAuth & {
        survivorPresets: SurvivorPresets | null;
    };

type SlotName = 'slot_0' | 'slot_1' | 'slot_2' | 'slot_3' | 'slot_4';

export type Accounts = {
    user_id: string;
    slot_0: SlotData | null;
    slot_1: SlotData | null;
    slot_2: SlotData | null;
    slot_3: SlotData | null;
    slot_4: SlotData | null;
    active_slot: number | 0;
};

export type AutoDaily = {
    user_id: string;
};

export type DupeWhitelist = {
    user_id: string;
};

export type PresetData = {
    name: string | null;
    characterIds: string[];
    squadIds: string[];
    slotIndices: number[];
};
