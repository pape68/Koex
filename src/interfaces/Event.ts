import Bot from '../structures/Bot';

export interface Event {
    (client: Bot, ...args: any[]): void;
}
