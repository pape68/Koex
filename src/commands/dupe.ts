import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import { Accounts, DupeWhitelist, SlotName } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import supabase from '../utils/functions/supabase';
import defaultResponses from '../utils/helpers/defaultResponses';

const command: Command = {
    name: 'dupe',
    description: 'Brings up the dupe menu.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const whitelist = await supabase
            .from<DupeWhitelist>('dupe_whitelist')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!whitelist.data) {
            await interaction.editReply({
                embeds: [createEmbed('error', `You don't have permission to use \`/${interaction.commandName}\`.`)]
            });
            return;
        }

        const { data: account } = await supabase
            .from<Accounts>('accounts_test')
            .select('*')
            .match({ user_id: interaction.user.id })
            .maybeSingle();

        if (!account) {
            await interaction.followUp(defaultResponses.loggedOut);
            return;
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);
        const auth = account[('slot_' + account.active_slot) as SlotName];

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Color.gray)
            .addFields([
                {
                    name: 'Dupe Menu',
                    value: 'Click the buttons below to toggle the dupe.'
                }
            ])
            .setFooter({ text: auth!.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Start Dupe').setStyle(ButtonStyle.Primary).setCustomId('startDupe'),
            new ButtonBuilder().setLabel('Stop Dupe').setStyle(ButtonStyle.Secondary).setCustomId('stopDupe')
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};

export default command;
