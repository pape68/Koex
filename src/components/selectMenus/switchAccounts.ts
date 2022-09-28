import { SelectMenuInteraction } from 'discord.js';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import createAuthData from '../../utils/commands/createAuthData';
import { saveAccount } from '../../utils/functions/database';
import createDeviceAuth from '../../api/auth/createDeviceAuth';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'switchAccounts',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accountId = interaction.values[0];

        const auth = await createAuthData(interaction.user.id, accountId);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const deviceAuth = await createDeviceAuth(auth.accessToken, auth.accountId);

        await saveAccount(interaction.user.id, {
            displayName: auth.displayName,
            accountId: auth.accountId,
            deviceId: deviceAuth.deviceId,
            secret: deviceAuth.secret
        });
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully switched to account **${auth.displayName}**.`)]
        });
        return;
    }
};

export default selectMenu;
