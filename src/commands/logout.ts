import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts, SlotData, SlotName } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';
import { getAllAccounts } from '../utils/functions/database';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'logout',
    description: 'Logout from your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        // TODO: SELECT MENU TO LOGOUT FROM SPECIFIC ACCOUNTS

        await interaction.deferReply();

        const accounts = await getAllAccounts(interaction.user.id, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        let activeSlotIndex = 0;
        for (let i = 0; i < 5; i++) {
            const auth: SlotData | null = accounts![('slot_' + i) as SlotName];

            if (activeSlotIndex === i) continue;

            if (auth) {
                activeSlotIndex = i;
                break;
            }
        }

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        try {
            await supabase.from<Accounts>('accounts_test').upsert({
                user_id: interaction.user.id,
                ['slot_' + activeSlotIndex]: null,
                active_slot: activeSlotIndex
            });
        } catch (error) {
            await interaction.editReply({
                embeds: [createEmbed('error', `Failed to logout of **${auth.displayName}**.`)]
            });
            return;
        } finally {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Goodbye, ${auth.displayName}`,
                            iconURL: characterAvatarUrl ?? undefined
                        })
                        .setColor(Color.GRAY)
                ]
            });
            return;
        }
    }
};

export default command;
