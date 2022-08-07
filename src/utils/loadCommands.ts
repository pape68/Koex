import {
    ApplicationCommandType,
    ChatInputApplicationCommandData,
    ComponentType,
    InteractionType
} from 'discord.js';
import { sync } from 'glob';
import { join } from 'path';

import { Button } from '../interfaces/Button';
import { Command } from '../interfaces/Command';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import { Modal } from '../interfaces/Modal';
import registerCommands from './registerCommands';

const loadCommands = (client: ExtendedClient) => {
    const commands: ChatInputApplicationCommandData[] = [];
    const files = sync('src/commands/**/*.ts');

    for (const file of files) {
        const path = join(process.cwd(), file);
        const interaction: Button | Command | Modal = require(path).default;

        switch (interaction.options.type) {
            case ApplicationCommandType.ChatInput:
                client.interactions.set(interaction.options.name, interaction);
                break;
            case ComponentType.Button:
                client.interactions.set(interaction.options.customId, interaction);
                continue;
            case InteractionType.ModalSubmit:
                client.interactions.set(interaction.options.customId, interaction);
                continue;
            default:
                continue;
        }

        commands.push(interaction.options);
    }

    registerCommands(client, commands);
};

export default loadCommands;
