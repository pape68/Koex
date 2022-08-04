import { REST } from '@discordjs/rest';
import { SupabaseClient } from '@supabase/supabase-js';
import { Client, ClientOptions, Collection, ComponentType } from 'discord.js';
import { ApplicationCommandType, InteractionType, Routes } from 'discord-api-types/v10';
import { sync } from 'glob';
import { join } from 'path';
import { Logger } from 'pino';

import { Button } from '../interfaces/Button';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';

import * as utils from '../utils';

export default class Bot extends Client {
    public interactions: Collection<string, Command & Button>;
    public cooldowns: Collection<string, Collection<any, any>>;
    public logger: Logger;
    public supabase: SupabaseClient;
    public utils: typeof utils;

    public constructor(options: ClientOptions) {
        super(options);

        this.interactions = new Collection();
        this.cooldowns = new Collection();
        this.logger = utils.logger;
        this.supabase = utils.supabase;
        this.utils = utils;
    }

    public loadCommands() {
        const commands: any[] = [];
        const files = sync('src/commands/**/*.ts');

        for (const file of files) {
            const path = join(process.cwd(), file);
            const interaction = require(path).default;

            this.interactions.set(
                interaction.options.type === ApplicationCommandType.ChatInput
                    ? interaction.options.name
                    : interaction.options.customId,
                interaction
            );

            if (!interaction.options.type) continue;
            if (interaction.options.type === ComponentType.Button) continue;
            commands.push(interaction.options);
        }

        this.registerCommands(commands);
    }

    public loadEvents() {
        const files = sync('src/events/**/*.ts');

        for (const file of files) {
            const name = file.split('/').pop()!.split('.')[0];
            const path = join(process.cwd(), file);
            const event: Event = require(path).default;

            this.on(name, event.bind(null, this));
        }
    }

    public async registerCommands(commands: any[]) {
        if (!this.isReady()) return;

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

        try {
            await rest.put(Routes.applicationCommands(this.user!.id), {
                body: commands
            });

            this.logger.info('Loaded application (/) commands.');
        } catch (error) {
            this.logger.error(error);
        }
    }

    public start() {
        super.login().then(() => {
            this.loadEvents();
        });
    }
}
