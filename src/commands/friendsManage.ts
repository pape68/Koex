import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    SelectMenuOptionBuilder
} from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/functions/createAuthData';
import getAvatar from '../utils/functions/getAvatar';

const command: Command = {
    name: 'manage-friends',
    description: 'Manage your friends list on Epic Games.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await createAuthData(interaction.user.id);
        const avatarUrl = await getAvatar(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Manage Friends')
            .setColor(Color.BLUE)
            .setDescription(`Click an option below to manage your friends list.`)
            .setFooter({ text: auth.displayName, iconURL: avatarUrl });

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setCustomId('selectFriendAction')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    new SelectMenuOptionBuilder().setLabel('Accept All').setValue('acceptAll'),
                    new SelectMenuOptionBuilder().setLabel('Cancel All').setValue('cancelAll'),
                    new SelectMenuOptionBuilder().setLabel('Reject All').setValue('rejectAll'),
                    new SelectMenuOptionBuilder().setLabel('Remove All').setValue('removeAll'),
                    new SelectMenuOptionBuilder().setLabel('Unblock All').setValue('unblockAll')
                )
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
