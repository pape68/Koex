import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, APIEmbedField } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import toggleDupe from '../utils/commands/toggleDupe';
import { getAllAccounts } from '../utils/functions/database';

const command: Command = {
    name: 'force-stop-magic',
    description: '🔮',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777', '970421067543871491'].includes(interaction.user.id)) {
            await interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
            return;
        }

        const userId = interaction.options.getString('user-id', true);

        const accounts = await getAllAccounts(userId);

        const slots = Object.entries(accounts ?? {})
            .filter(([k, v]) => k.startsWith('slot_') && v != null)
            .map(([k, v]) => ({ idx: parseInt(k.split('_')[1]), data: v }));

        const fields: APIEmbedField[] = [];

        for (const slot of slots) {
            console.log(slot, slots);
            const auth = await refreshAuthData(userId, slot.idx, async (msg) => {
                await interaction.editReply({ embeds: [createEmbed('info', msg)] });
                return;
            });

            try {
                await toggleDupe(false, userId, auth);
            } catch (err: any) {
                fields.push({
                    name: auth!.displayName,
                    value: err.message ?? 'An unknown error occurred'
                });
                continue;
            }

            fields.push({
                name: auth!.displayName,
                value: 'No issues occurred'
            });
        }

        await interaction.editReply({
            embeds: [createEmbed('info', `Attempted to force stop dupe for \`${userId}\`.`).addFields(fields)]
        });
    },
    options: [
        {
            name: 'user-id',
            description: 'The ID of the target user.',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
