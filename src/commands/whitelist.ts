import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import supabase from '../utils/functions/supabase';
import { DupeWhitelist } from '../types/supabase';
import { PostgrestResponse } from '@supabase/supabase-js';

const command: Command = {
    name: 'whitelist',
    description: 'Adds a user to the dupe whitelist.',
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

        let whitelist: PostgrestResponse<DupeWhitelist>;

        switch (state) {
            case 'add':
                whitelist = await supabase.from<DupeWhitelist>('dupe_whitelist').upsert({
                    user_id: userId
                });

                if (whitelist.error) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update whitelist.')]
                    });
                }

                return interaction.editReply({
                    embeds: [createEmbed('info', `Added ID \`${userId}\` to the whitelist.`)]
                });
            case 'remove':
                whitelist = await supabase.from<DupeWhitelist>('dupe_whitelist').delete().match({
                    user_id: userId
                });

                if (whitelist.error) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update whitelist.')]
                    });
                }

                return interaction.editReply({
                    embeds: [createEmbed('info', `Removed ID \`${userId}\` from the whitelist.`)]
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
            description: 'Add or remove the whitelist.',
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
