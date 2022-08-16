import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';
import _ from 'lodash';

import { COLORS, FORTNITE_GAME_CLIENT } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts } from '../typings/supabase';
import createEmbed from '../utils/functions/createEmbed';
import getUserData from '../utils/functions/getUserData';
import refreshUserData from '../utils/functions/refreshUserData';
import supabase from '../utils/functions/supabase';

const command: Command = {
    execute: async (interaction) => {
        await interaction.deferReply();

        const slot = interaction.options.getInteger('slot')!;
        const targetSlot = slot - 1;

        const user: Accounts = await getUserData(interaction.user.id, interaction, false);

        const slots = { ...user } as any;
        delete slots.user_id;
        delete slots.active_slot;

        const managingAccounts = ['remove', 'use'].includes(interaction.options.getSubcommand());

        if (managingAccounts && _.isEmpty(slots['slot_' + targetSlot])) {
            return interaction.editReply({
                embeds: [createEmbed('info', `No account on this slot. \`/account list\``)]
            });
        }

        if (managingAccounts && !_.isEmpty(user)) await refreshUserData(interaction.user.id);

        switch (interaction.options.getSubcommand()) {
            case 'add':
                if (Object.values(slots).every((slot) => !_.isEmpty(slot))) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', "Can't connect more than 5 accounts.")]
                    });
                }

                const baseURL = `https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%3D${FORTNITE_GAME_CLIENT.id}%26responseType%3Dcode%0A`;

                const addAttachment = new AttachmentBuilder(process.cwd() + '/assets/authCode.png');

                const addEmbed = new EmbedBuilder()
                    .setColor(COLORS.blue)
                    .addFields([
                        {
                            name: 'Signing In',
                            value: `\` - \` Click the **Epic Games** button below.\n\` - \` Copy the 32 character \`authorizationCode\`.\n\` - \` Click the **Sign In** button and paste your code.`
                        },
                        {
                            name: 'Switching Accounts',
                            value: `Use [this link](${baseURL}&prompt=login) rather than the button below to switch accounts.`
                        }
                    ])
                    .setImage('attachment://authCode.png');

                const addRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setLabel('Epic Games').setStyle(ButtonStyle.Link).setURL(baseURL),
                    new ButtonBuilder().setLabel('Sign In').setStyle(ButtonStyle.Primary).setCustomId('signIn')
                );

                return interaction.editReply({
                    embeds: [addEmbed],
                    components: [addRow],
                    files: [addAttachment]
                });
            case 'remove':
                let activeSlotIndex = 0;
                for (let i = 0; i < 5; i++) {
                    if (targetSlot === i) continue;

                    if (!_.isEmpty(slots['slot_' + targetSlot])) {
                        activeSlotIndex = i;
                        break;
                    }
                }

                try {
                    await supabase.from<Accounts>('accounts').upsert({
                        user_id: interaction.user.id,
                        ['slot_' + targetSlot]: {},
                        active_slot: activeSlotIndex
                    });
                } catch (error) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', `Failed to remove account on slot \`${slot}\`.`)]
                    });
                } finally {
                    return interaction.editReply({
                        embeds: [createEmbed('success', `Removed account on slot \`${slot}\`.`)]
                    });
                }
            case 'use':
                if (user.active_slot === targetSlot) {
                    return interaction.editReply({
                        embeds: [createEmbed('info', `Account slot is already active. \`/account list\``)]
                    });
                }

                try {
                    await supabase.from<Accounts>('accounts').upsert({
                        ...user,
                        active_slot: slot - 1
                    });
                } catch (error: any) {
                    return interaction.editReply({
                        embeds: [createEmbed('error', 'Failed to update active account slot.')]
                    });
                } finally {
                    return interaction.editReply({
                        embeds: [createEmbed('success', `Using account on slot \`${slot}\`.`)]
                    });
                }
            case 'list':
                const accounts = Object.values(slots).map((value: any, index) => ({
                    username: value.displayName ?? 'No Account',
                    slot: index + 1
                }));

                const listEmbed = new EmbedBuilder().setColor(COLORS.blue).addFields([
                    {
                        name: 'Accounts',
                        value:
                            '```md\n#. Username\n' +
                            accounts
                                .map(({ username, slot }) =>
                                    !accounts.length ? 'No Accounts' : `${slot}. ${username}`
                                )
                                .join('\n') +
                            '\n```'
                    }
                ]);

                return interaction.editReply({ embeds: [listEmbed] });
        }
    },
    name: 'account',
    description: 'Manage your accounts.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'add',
            description: 'Add an account to your next available slot.',
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'remove',
            description: 'Remove the account from the specified slot.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'slot',
                    description: 'The slot to remove the account from.',
                    required: true,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 1,
                    max_value: 5
                }
            ]
        },
        {
            name: 'use',
            description: 'Use the account in the specified slot.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'slot',
                    description: 'The slot to use the account of.',
                    required: true,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 1,
                    max_value: 5
                }
            ]
        },
        {
            name: 'list',
            description: 'List your account in each slot.',
            type: ApplicationCommandOptionType.Subcommand
        }
    ]
};

export default command;
