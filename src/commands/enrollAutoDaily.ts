import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

import { PostgrestResponse } from '@supabase/supabase-js';
import { Command } from '../interfaces/Command';
import { AutoDaily } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import supabase from '../utils/functions/supabase';

const command: Command = {
    name: 'enroll-auto-daily',
    description: 'Enrolls in auto daily reward claims.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const state = interaction.options.getString('change')!;

        let autoDaily: PostgrestResponse<AutoDaily>;

        switch (state) {
            case 'join':
                autoDaily = await supabase.from<AutoDaily>('auto_daily').upsert({
                    user_id: interaction.user.id
                });

                if (autoDaily.error) {
                    await interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update enrollment status.')]
                    });
                    return;
                }

                await interaction.editReply({
                    embeds: [createEmbed('info', `Enrolled in auto daily reward claims.`)]
                });
                return;
            case 'leave':
                autoDaily = await supabase.from<AutoDaily>('auto_daily').delete().match({
                    user_id: interaction.user.id
                });

                if (autoDaily.error) {
                    await interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update enrollment status.')]
                    });
                    return;
                }

                await interaction.editReply({
                    embeds: [createEmbed('info', `Unenrolled from auto daily reward claims.`)]
                });
        }
    },
    options: [
        {
            name: 'change',
            description: 'Join or leave the enrollment.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'Join',
                    value: 'join'
                },
                {
                    name: 'Leave',
                    value: 'leave'
                }
            ]
        }
    ]
};

export default command;
