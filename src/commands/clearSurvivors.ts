import { ApplicationCommandType } from 'discord.js';

import createOperationRequest from '../api/mcp/createOperationRequest';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'clear-survivors',
    description: '*** Clears all Save the World survivor squads. ***',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const unassignAllSquadsRes = await createOperationRequest(
            auth,
            'campaign',
            'UnassignAllSquads'
        );

        if (unassignAllSquadsRes.error) {
            interaction.followUp({
                embeds: [createEmbed('error', '`' + unassignAllSquadsRes.error.message + '`')]
            });
            return;
        }

        interaction.editReply({
            embeds: [createEmbed('success', 'Cleared all survivor squads.')]
        });
    }
};

export default command;
