import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import supabase from '../utils/functions/supabase';
import { DupeBlacklist } from '../types/supabase';
import { PostgrestResponse } from '@supabase/supabase-js';

const command: Command = {
    name: 'blacklist',
    description: 'Adds a user to the dupe blacklist.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777'].includes(interaction.user.id)) {
            return interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
        }

        const userId = interaction.options.getString('user-id')!;
        const state = interaction.options.getString('change')!;

        let blacklist: PostgrestResponse<DupeBlacklist>;

        switch (state) {
            case 'add':
                blacklist = await supabase.from<DupeBlacklist>('dupe_blacklist').upsert({
                    user_id: userId
                });

                if (blacklist.error) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update blacklist.')]
                    });
                }

                return interaction.editReply({
                    embeds: [createEmbed('info', `Added ID \`${userId}\` to the blacklist.`)]
                });
            case 'remove':
                blacklist = await supabase.from<DupeBlacklist>('dupe_blacklist').delete().match({
                    user_id: userId
                });

                if (blacklist.error) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update blacklist.')]
                    });
                }

                return interaction.editReply({
                    embeds: [createEmbed('info', `Removed ID \`${userId}\` from the blacklist.`)]
                });
        }
    },
    options: [
        {
            name: 'user-id',
            description: 'The ID of the target user.',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'change',
            description: 'Add or remove the blacklist.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Add',
                    value: 'add'
                },
                {
                    name: 'Remove',
                    value: 'remove'
                }
            ]
        }
    ]
};

export default command;
