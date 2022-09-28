import { ModalSubmitInteraction } from 'discord.js';

import createDeviceAuth from '../../api/auth/createDeviceAuth';
import createOAuthData from '../../api/auth/createOAuthData';
import { fortniteGameClient } from '../../constants';
import { Component } from '../../interfaces/Component';
import { setAuths, saveAuth } from '../../utils/functions/database';
import createEmbed from '../../utils/commands/createEmbed';

const modal: Component<ModalSubmitInteraction> = {
    name: 'auth',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.fields.getTextInputValue('code');

        const oAuthData = await createOAuthData(fortniteGameClient._name, {
            grant_type: 'authorization_code',
            code
        });

        const deviceAuth = await createDeviceAuth(oAuthData.access_token, oAuthData.account_id);
        const auths = await setAuths(interaction.user.id);

        if (auths.length === 5) {
            await interaction.editReply({
                embeds: [createEmbed('info', `You already have 5 accounts saved.`)]
            });
            return;
        }

        const isSaved = auths.filter((auth) => auth.accountId === deviceAuth.accountId);
        if (isSaved.length) {
            await interaction.editReply({
                embeds: [createEmbed('info', `You already have the account **${oAuthData.displayName}** saved.`)]
            });
            return;
        }

        await saveAuth(interaction.user.id, { ...deviceAuth, displayName: oAuthData.displayName });
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully saved the account **${oAuthData.displayName}**.`)]
        });
        return;
    }
};

export default modal;
