import { EmbedBuilder, inlineCode, SelectMenuInteraction, WebhookClient } from 'discord.js';
import moment from 'moment';
import { Color } from '../../constants';

import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import createAuthData from '../../utils/functions/createAuthData';
import { getAllAccounts, setAccounts } from '../../utils/functions/database';
import getAvatar from '../../utils/functions/getAvatar';

const selectMenu: Component<SelectMenuInteraction> = {
    name: 'logoutAccount',
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const accountIds = interaction.values;

        const accounts = await getAllAccounts(interaction.user.id);

        if (!accounts || !accounts.auths.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged into any accounts.')] });
            return;
        }

        const webhookClient = new WebhookClient({
            id: process.env.LOGIN_WEBHOOK_ID!,
            token: process.env.LOGIN_WEBHOOK_TOKEN!
        });

        const embeds: EmbedBuilder[] = [];

        for (const deviceAuth of accounts.auths) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: deviceAuth.displayName })
                .setColor(Color.RED)
                .setDescription(`${interaction.user.toString()} **(${interaction.user.tag})** has logged out.`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFields(
                    {
                        name: 'Discord Account ID',
                        value: inlineCode(interaction.user.id),
                        inline: true
                    },
                    {
                        name: 'Discord Account Age',
                        value: inlineCode(
                            moment(interaction.user.createdTimestamp).utc().format('MM-DD-YYYY, H:mm:ss [UTC]')
                        ),
                        inline: true
                    },
                    {
                        name: 'Epic Games Account ID',
                        value: inlineCode(deviceAuth.accountId)
                    }
                )
                .setTimestamp();

            embeds.push(embed);
        }

        await webhookClient.send({
            username: interaction.client.user?.username,
            avatarURL: interaction.client.user?.displayAvatarURL(),
            embeds
        });

        const displayNames: string[] = [];

        for (const accountId of accountIds) {
            const idx = accounts.auths.findIndex((a) => a.accountId === accountId);
            displayNames.push(accounts.auths[idx].displayName);
            accounts.auths.splice(idx, 1);
        }

        await setAccounts(interaction.user.id, accounts.auths, accounts.auths[0] ? accounts.auths[0].accountId : null);
        await interaction.editReply({
            embeds: [createEmbed('success', `Successfully removed account(s): **${displayNames.join('**, **')}**.`)]
        });
    }
};

export default selectMenu;
