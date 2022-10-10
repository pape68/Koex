import { Client, Collection } from 'discord.js';
import LRU from 'lru-cache';

import { Command } from './Command';
import { Component, ComponentInteraction } from './Component';

export interface ExtendedClient extends Client {
    cache: LRU<string, Buffer>;
    commands: Collection<string, Command>;
    components: Collection<string, Component<ComponentInteraction>>;
}
