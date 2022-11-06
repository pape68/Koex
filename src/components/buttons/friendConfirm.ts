import { ActionRowBuilder, ButtonInteraction, SelectMenuOptionBuilder } from 'discord.js';

import { SelectMenuBuilder } from 'discord.js';
import addFriendFromId from '../../api/friend/addFriendFromId';
import getBlocklist from '../../api/friend/getBlocklist';
import getIncomingRequests from '../../api/friend/getIncomingRequests';
import getOutgoingRequests from '../../api/friend/getOutgoingRequests';
import removeAllFriends from '../../api/friend/removeAllFriends';
import removeFriendFromId from '../../api/friend/removeFriendFromId';
import unblockUserFromId from '../../api/friend/unblockUserFromId';
import { PartialFriend } from '../../api/utils/helpers/interfaces';
import { Component } from '../../interfaces/Component';
import createEmbed from '../../utils/commands/createEmbed';
import createAuthData from '../../utils/functions/createAuthData';

const button: Component<ButtonInteraction> = {
    name: 'friendConfirm',
    execute: async (interaction) => {
        const action = interaction.customId.split(/-+/).pop();

        if (!action) {
            throw new Error('Unknown Action');
        }

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        let list: PartialFriend[] = [];
        switch (action) {
            case 'acceptAll':
                list = await getIncomingRequests(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await addFriendFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
            case 'cancelAll':
                list = await getOutgoingRequests(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await removeFriendFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
            case 'rejectAll':
                list = await getIncomingRequests(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await removeFriendFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
            case 'removeAll':
                await removeAllFriends(auth.accessToken, auth.accountId);
                break;
            case 'unblockAll':
                list = await getBlocklist(auth.accessToken, auth.accountId);

                for (const entry of list) {
                    await unblockUserFromId(auth.accessToken, auth.accountId, entry.accountId);
                }

                break;
        }

        const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
            new SelectMenuBuilder()
                .setCustomId('selectFriendAction')
                .setMaxValues(1)
                .setMinValues(1)
                .setOptions(
                    new SelectMenuOptionBuilder().setLabel('Accept All').setValue('acceptAll'),
                    new SelectMenuOptionBuilder().setLabel('Cancel All').setValue('cancelAll'),
                    new SelectMenuOptionBuilder().setLabel('Reject All').setValue('rejectAll'),
                    new SelectMenuOptionBuilder().setLabel('Remove All').setValue('removeAll'),
                    new SelectMenuOptionBuilder().setLabel('Unblock All').setValue('unblockAll')
                )
                .setPlaceholder('Anything else?')
        );

        await interaction.update({ components: [row] });
    }
};

export default button;
