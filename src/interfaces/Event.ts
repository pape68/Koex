import { ExtendedClient } from './ExtendedClient';

export interface Event {
    options?: {
        name?: string;
        once?: boolean;
    };
    execute: (client: ExtendedClient, ...args: any[]) => Promise<any>;
}
