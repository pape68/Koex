import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import composeMcp from '../api/mcp/composeMcp';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/functions/createAuthData';
import { PublicProfileData } from '../utils/helpers/operationResources';

const command: Command = {
    name: 'homebasename',
    description: 'Change your Save the World Homebase name.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const change = interaction.options.getString('change', true);

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const publicProfile = await composeMcp<PublicProfileData>(auth, 'common_public', 'QueryProfile');
        const oldName = publicProfile.profileChanges[0].profile.stats.attributes.homebase_name;

        await composeMcp<PublicProfileData>(auth, 'common_public', 'SetHomebaseName', { homebaseName: change });
        await interaction.editReply({
            embeds: [createEmbed('success', `Changed Homebase name from **${oldName}** to **${change}**.`)]
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
