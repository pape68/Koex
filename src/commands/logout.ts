import { ApplicationCommandType } from 'discord.js';

import { Command } from '../interfaces/Command';
import { Accounts, AuthData, SlotName } from '../types/supabase';
import createEmbed from '../utils/functions/createEmbed';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'logout',
    description: 'Logout from your active Epic Games account.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const { data: account, error } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!account) return interaction.editReply(defaultResponses.loggedOut);

        if (error) return authErrorResponse();

        let activeSlotIndex = 0;
        for (let i = 0; i < 5; i++) {
            const auth: AuthData | null = account[('slot_' + i) as SlotName];

            if (activeSlotIndex === i) continue;

            if (auth) {
                activeSlotIndex = i;
                break;
            }
        }

        const auth: AuthData | null = account[('slot_' + activeSlotIndex) as SlotName];

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        try {
            await supabase.from<Accounts>('accounts_test').upsert({
                user_id: interaction.user.id,
                ['slot_' + activeSlotIndex]: null,
                active_slot: activeSlotIndex
            });
        } catch (error) {
            return interaction.editReply({
                embeds: [createEmbed('error', `Failed to logout of **${auth.displayName}**.`)]
            });
        } finally {
            return interaction.editReply({
                embeds: [createEmbed('success', `Logged out of **${auth.displayName}**.`)]
            });
        }
    }
};

export default command;
function authErrorResponse(): any {
    throw new Error('Function not implemented.');
}
