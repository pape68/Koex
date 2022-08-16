import { ExtendedClient } from './ExtendedClient';

export interface Event<T extends boolean = false> {
    name?: string;
    once?: T;
    execute: (client: ExtendedClient, ...args: any[]) => Promise<any>;
}
