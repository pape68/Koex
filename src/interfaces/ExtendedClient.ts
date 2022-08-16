import { Client, Collection } from 'discord.js';
import { Logger } from 'pino';

import { Command } from './Command';
import { Component, ComponentInteraction } from './Component';

export interface ExtendedClient extends Client {
    cooldowns: Collection<string, Collection<any, any>>;
    interactions: Collection<string, Command | Component<ComponentInteraction>>;
    logger: Logger;
}
