import { ApplicationCommandType, AttachmentBuilder } from 'discord.js';

import { Command } from '../interfaces/Command';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import generateCatalogImage from '../utils/functions/generateCatalogImage';

const command: Command = {
    name: 'itemshop',
    description: 'Generate an image of the Battle Royale item shop.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const client = interaction.client as ExtendedClient;

        const cached = client.cache.get('catalog');

        let image: Buffer | undefined = undefined;

        if (cached) image = cached;
        else {
            image = await generateCatalogImage();
            client.cache.set('catalog', image);
        }

        const attachment = new AttachmentBuilder(image, { name: 'catalog.png' });

        interaction.editReply({ files: [attachment] });
    }
};

export default command;
