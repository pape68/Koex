import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import createOperationRequest from '../api/mcp/createOperationRequest';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'homebase-name',
    description: 'Change your Save the World Homebase name.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const newName = interaction.options.getString('change', true);

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const queryProfileRes = await createOperationRequest(auth, 'common_public', 'QueryProfile');

        const oldName =
            queryProfileRes.data?.profileChanges[0].profile.stats.attributes.homebase_name;

        if (queryProfileRes.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + queryProfileRes.error.message + '`')]
            });
            return;
        }

        const setHomebaseNameRes = await createOperationRequest(
            auth,
            'common_public',
            'SetHomebaseName',
            {
                homebaseName: newName
            }
        );

        if (setHomebaseNameRes.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + setHomebaseNameRes.error.message + '`')]
            });
            return;
        }

        await interaction.editReply({
            embeds: [
                createEmbed(
                    'success',
                    `Changed Homebase name from **${oldName}** to **${newName}**.`
                )
            ]
        });
    },
    options: [
        {
            name: 'change',
            description: 'The new name for your Homebase.',
            required: true,
            type: ApplicationCommandOptionType.String,
            min_length: 3,
            max_length: 16
        }
    ]
};

export default command;
