import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder, EmbedBuilder } from 'discord.js';

import { Emoji } from '../constants';
import sendPartyPatch from '../api/party/sendPartyPatch';
import getParty from '../api/party/getParty';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError';
import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/functions/createAuthData';
import getAvatar from '../utils/functions/getAvatar';

const command: Command = {
    name: 'fakecrownwins',
    description: 'EA SPOTS.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const crowns = interaction.options.getInteger('crowns', true).toString();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const cosmeticUpdate = {
            'Default:AthenaCosmeticLoadout_j': JSON.stringify({
                AthenaCosmeticLoadout: {
                    cosmeticStats: [
                        {
                            statName: 'TotalVictoryCrowns',
                            statValue: 0
                        },
                        {
                            statName: 'TotalRoyalRoyales',
                            statValue: crowns
                        },
                        {
                            statName: 'HasCrown',
                            statValue: 1
                        }
                    ]
                }
            })
        };

        const body = {
            delete: [],
            revision: 1,
            update: cosmeticUpdate
        };

        const party = await getParty(auth.accessToken, auth.accountId);

        if (!party.current.length) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not in a party.')] });
            return;
        }

        try {
            const meta = await sendPartyPatch(auth.accessToken, auth.accountId, party.current[0].id, body);
            console.log(meta);
        } catch (err: any) {
            const error: EpicGamesAPIError = err;

            if (error.code === 'errors.com.epicgames.social.party.stale_revision') {
                body.revision = parseInt(error.messageVars[1], 10);
                await sendPartyPatch(auth.accessToken, auth.accountId, party.current[0].id, body);
            }
        }

        const characterAvatarUrl = await getAvatar(interaction.user.id);
        const thumbnail = new AttachmentBuilder(process.cwd() + '/assets/fortniteCrown.png');

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Fake Crown Wins' })
            .setColor(Color.GREEN)
            .setDescription(`${Emoji.CHECK} Successfully set crowns to **${crowns}**.`)
            .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setThumbnail('attachment://fortniteCrown.png')
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [thumbnail] });
    },
    options: [
        {
            name: 'crowns',
            description: 'The name of the cosmetic to equip.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            min_value: 0,
            max_value: 99999
        }
    ]
};

export default command;
