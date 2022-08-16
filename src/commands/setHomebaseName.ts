import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import _ from 'lodash';

import { Command } from '../interfaces/Command';
import { AuthData } from '../typings/supabase';
import createEmbed from '../utils/functions/createEmbed';
import getUserData from '../utils/functions/getUserData';
import operationRequest from '../utils/functions/operationRequest';

const command: Command = {
    execute: async (interaction) => {
        await interaction.deferReply();

        const update = interaction.options.getString('update')!;
        const user: AuthData = await getUserData(interaction.user.id, interaction);

        if (_.isEmpty(user))
            return interaction.editReply({
                embeds: [createEmbed('info', 'You must be signed in to use this command.')]
            });

        const { data, error } = await operationRequest(user, 'SetHomebaseName', 'common_public', {
            homebaseName: update
        });

        if (!data || error) return interaction.editReply({
                embeds: [createEmbed('error', `Failed to update homebase name.`)]
            });

        return interaction.editReply({
            embeds: [createEmbed('success', `Updated homebase name to **${update}**.`)]
        });
    },
    name: 'set-homebase-name',
    description: 'Updates your homebase name.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'update',
            description: 'The updated homebase name.',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
