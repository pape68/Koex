import { SelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import createAuthData from '../../utils/commands/createAuthData';
import { saveAuth } from '../../utils/functions/database';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'switchAccounts',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accountId = interaction.values[0];

        const auth = await createAuthData(interaction.user.id, accountId);

        if (!auth) {
            return;
        }

        await saveAuth(interaction.user.id, {
            displayName: auth.displayName,
            accountId: auth.accountId,
            deviceId: auth.deviceId,
            secret: auth.secret
        });
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully switched to account **${auth.displayName}**.`)]
        });
        return;
    }
};

export default selectMenu;
