import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { Emoji } from '../constants';

import sendPartyPatch from '../api/party/sendPartyPatch';
import getParty from '../api/party/getParty';
import EpicGamesAPIError from '../api/utils/errors/EpicGamesAPIError';
import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import createAuthData from '../utils/functions/createAuthData';
import getAvatar, { createCosmeticUrl } from '../utils/functions/getAvatar';
import getCosmeticFromName from '../utils/functions/getCosmeticFromName';

const command: Command = {
    name: 'fakelevel',
    description: 'EA SPOTS.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const level = interaction.options.getInteger('level', true).toString();

        const auth = await createAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply({ embeds: [createEmbed('info', 'You are not logged in.')] });
            return;
        }

        const cosmeticUpdate = {
            'Default:AthenaBannerInfo_j': JSON.stringify({
                AthenaBannerInfo: {
                    seasonLevel: level
                }
            })
        };

        const body = {
            delete: [],
            revision: 1,
            update: cosmeticUpdate
        };

        console.log(body);

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
        const thumbnail = new AttachmentBuilder(process.cwd() + '/assets/fortniteXp.png');

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Fake Level' })
            .setDescription(`${Emoji.CHECK} Successfully set level to **${level}**.`)
            .setThumbnail('attachment://fortniteXp.png')
            .setColor(Color.GREEN)
            .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [thumbnail] });
    },
    options: [
        {
            name: 'level',
            description: 'The fake level to set your account.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 999
        }
    ]
};

export default command;
