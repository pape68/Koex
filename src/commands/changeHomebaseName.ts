import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import composeMcp from '../api/mcp/composeMcp';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';
import { PublicProfileData } from '../utils/helpers/operationResources';

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

        const publicProfile = await composeMcp<PublicProfileData>(auth, 'common_public', 'QueryProfile');

        if (!publicProfile.data || publicProfile.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + publicProfile.error!.errorMessage + '`')]
            });
            return;
        }

        const oldName = publicProfile.data.profileChanges[0].profile.stats.attributes.homebase_name;

        const publicHomebase = await composeMcp<PublicProfileData>(auth, 'common_public', 'SetHomebaseName', {
            homebaseName: newName
        });

        if (!publicHomebase.data || publicHomebase.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + publicHomebase.error!.errorMessage + '`')]
            });
            return;
        }

        await interaction.editReply({
            embeds: [createEmbed('success', `Changed Homebase name from **${oldName}** to **${newName}**.`)]
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
