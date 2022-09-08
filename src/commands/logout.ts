import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import { COLORS } from '../constants';

import { Command } from '../interfaces/Command';
import { Accounts, SlotData, SlotName } from '../types/supabase';
import createEmbed from '../utils/commands/createEmbed';
import getCosmetic from '../utils/commands/getCosmetic';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'logout',
    description: 'Logout from your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const { data: account } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!account) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }
        let activeSlotIndex = 0;
        for (let i = 0; i < 5; i++) {
            const auth: SlotData | null = account[('slot_' + i) as SlotName];

            if (activeSlotIndex === i) continue;

            if (auth) {
                activeSlotIndex = i;
                break;
            }
        }

        const auth: SlotData | null = account[('slot_' + activeSlotIndex) as SlotName];

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const cosmeticUrl = await getCosmetic(interaction.user.id);

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
                            iconURL: cosmeticUrl ?? undefined
                        })
                        .setColor(COLORS.gray)
                ]
            });
            return;
        }
    }
};

export default command;
