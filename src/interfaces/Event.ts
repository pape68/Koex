import Bot from '../structures/Bot';

export interface Event {
    options?: {
        once?: boolean;
    };
    (client: Bot, ...args: any[]): void;
}
