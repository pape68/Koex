import {
    ActionRowBuilder,
    ApplicationCommandType,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'survivor-presets',
    description: 'Manage your Save the World Survior Presets.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        const auth = await refreshAuthData(interaction.user.id, undefined, async (msg) => {
            await interaction.reply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        const file = new AttachmentBuilder(process.cwd() + '/assets/survivors.png');

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setFields({
                name: 'Managing Squads',
                value: 'Use the buttons below the navigate the menu and manage your survivor presets.'
            })
            .setImage('attachment://survivors.png')
            .setFooter({ text: auth!.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Save Preset').setStyle(ButtonStyle.Primary).setCustomId('saveSurvivorPreset'),
            new ButtonBuilder()
                .setLabel('Load Preset')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('loadSurvivorPreset'),
            new ButtonBuilder()
                .setLabel('Rename Preset')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('renameSurvivorPreset'),
            new ButtonBuilder()
                .setLabel('Delete Presets')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('deleteSurvivorPresets')
        );

        await interaction.reply({ embeds: [embed], components: [row], files: [file] });
    }
};

export default command;
