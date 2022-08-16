import { ApplicationCommandType } from 'discord.js';
import _ from 'lodash';

import { Command } from '../interfaces/Command';
import { AuthData } from '../typings/supabase';
import createEmbed from '../utils/functions/createEmbed';
import getUserData from '../utils/functions/getUserData';
import operationRequest from '../utils/functions/operationRequest';

const command: Command = {
    execute: async (interaction) => {
        await interaction.deferReply();

        const user: AuthData = await getUserData(interaction.user.id, interaction);

        if (_.isEmpty(user))
            return interaction.editReply({
                embeds: [createEmbed('info', 'You must be signed in to use this command.')]
            });

        const { data, error } = await operationRequest(user, 'ClaimLoginReward', 'campaign');

        if (!data || error)
            return interaction.editReply({
                embeds: [createEmbed('error', 'Failed to claim you daily login reward.')]
            });

        return interaction.editReply({
            embeds: [createEmbed('success', `Claimed your daily login reward`)]
        });
    },
    name: 'claim-login-reward',
    description: 'Claim your daily login reward.',
    type: ApplicationCommandType.ChatInput
};

export default command;
