import { Client, Collection } from 'discord.js';

import { Command } from './Command';
import { Component, ComponentInteraction } from './Component';

export interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
    components: Collection<string, Component<ComponentInteraction>>;
}
