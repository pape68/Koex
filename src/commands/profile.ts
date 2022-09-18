import { ApplicationCommandType, EmbedBuilder } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { Color } from '../constants';
import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import getBanner from '../utils/commands/getBanner';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';
import { CampaignProfileData } from '../utils/helpers/operationResources';
import { Emoji } from './../constants';

const outpostNames = ['Stonewood', 'Plankerton', 'Canny Valley', 'Twine Peaks'];

const achievements: Partial<Record<string, keyof typeof Emoji>> = {
    'Quest:achievement_playwithothers': 'PLAYS_WELL_WITH_OTHERS',
    'Quest:achievement_savesurvivors': 'GUARDIAN_ANGEL',
    'Quest:achievement_loottreasurechests': 'LOOT_LEGEND',
    'Quest:achievement_destroygnomes': 'GO_GNOME',
    'Quest:achievement_killmistmonsters': 'UNSPEAKABLE_HORRORS',
    'Quest:achievement_buildstructures': 'TALENTED_BUILDER'
};

const command: Command = {
    name: 'profile',
    description: 'Claim your Save the World daily login reward.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const profile = await composeMcp<CampaignProfileData>(auth, 'campaign', 'QueryPublicProfile');

        if (!profile.data || profile.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + profile.error!.errorMessage + '`')]
            });
            return;
        }

        const data = profile.data.profileChanges[0].profile;

        const { level, rewards_claimed_post_max_level, research_levels } = data.stats.attributes;

        const emojis = Object.values(data.items)
            .filter((v) => Object.keys(achievements).includes(v.templateId) && v.attributes.quest_state === 'Claimed')
            .map((v) => Emoji[achievements[v.templateId] as keyof typeof Emoji]);

        const bannerUrl = await getBanner(interaction.user.id);
        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        const profileMeta = await composeMcp(auth, 'metadata', 'QueryProfile');

        if (!profileMeta.data || profileMeta.error) {
            interaction.followUp({
                embeds: [createEmbed('error', '`' + profile.error!.errorMessage + '`')]
            });
            return;
        }

        const metadata = profileMeta.data.profileChanges[0].profile;

        const outposts = Object.values(metadata.items)
            .filter((v) => v.templateId.startsWith('Outpost:'))
            .map((v, i) => `${outpostNames[i]}: \`${v.attributes.level}\``);

        const research = Object.entries(research_levels).map(
            ([k, v]) => `${Emoji[k.toUpperCase() as keyof typeof Emoji]} \`${v}\``
        );

        const embed = new EmbedBuilder()
            .setColor(Color.GRAY)
            .setAuthor({ name: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setDescription(emojis.length ? emojis.join(' ') : null)
            .addFields([
                {
                    name: 'Level',
                    value: `Commander: \`${level + (rewards_claimed_post_max_level ? ' (MAX)' : '')}\``,
                    inline: true
                },
                {
                    name: 'SSDs',
                    value: outposts.join('\n')
                },
                {
                    name: 'Research',
                    value: research.join(' '),
                    inline: true
                }
            ])
            .setThumbnail(bannerUrl)
            .setFooter({ text: `Account ID: ${auth.accountId}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
