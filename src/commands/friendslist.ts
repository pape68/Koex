import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import getFromAccountIds from '../api/account/getFromAccountIds';
import getFriendSummary from '../api/friend/getFriendsList';
import { Command } from '../interfaces/Command';
import createAuthData from '../utils/commands/createAuthData';
import createEmbed from '../utils/commands/createEmbed';

const command: Command = {
    name: 'friendslist',
    description: 'Display your friends list.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const friendsList = await getFriendSummary(auth.accessToken, auth.accountId);

        const ids = friendsList.friends.map((friend) => friend.accountId);

        const friendAccounts = await getFromAccountIds(auth.accessToken, ids);

        const embed = new EmbedBuilder()
            .setTitle('Friends List')
            .setDescription(friendAccounts.map((friendAccount) => friendAccount.displayName).join('\n'));

        interaction.editReply({ embeds: [embed] });
    }
};

export default command;
