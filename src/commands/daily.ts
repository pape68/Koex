import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import composeMcp from '../api/mcp/composeMcp';

import { Command } from '../interfaces/Command';
import defaultResponses from '../utils/helpers/defaultResponses';

import { Color } from '../constants';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };
import { CampaignProfileData } from '../utils/helpers/operationResources';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';

const command: Command = {
    name: 'daily',
    description: 'Claim your Save the World daily login reward.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id, undefined, async (msg) => {
            await interaction.editReply({ embeds: [createEmbed('info', msg)] });
            return;
        });

        const campaignProfile = await composeMcp<CampaignProfileData>(auth!, 'campaign', 'ClaimLoginReward');
        const rewards = campaignProfile.profileChanges[0].profile.stats.attributes.daily_rewards as Required<
            CampaignProfileData['daily_rewards']
        >;

        const { totalDaysLoggedIn } = rewards;
        const rewardValues: string[] = [];

        for (let i = 0; i < 6; i++) {
            const nextLoginDay = totalDaysLoggedIn + i;
            rewardValues.push(`\`${nextLoginDay}\` **${(rewardData as any)[nextLoginDay % 336]}**`);
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.YELLOW)
            .addFields([
                {
                    name: `Today's Reward ${
                        campaignProfile.notifications[0].items?.length === 0 ? '(Already Claimed)' : ''
                    }`,
                    value: rewardValues[0]
                },
                {
                    name: "Tomorrow's Reward",
                    value: rewardValues[1]
                },
                {
                    name: 'Upcoming Rewards',
                    value: rewardValues.slice(2).join('\n')
                }
            ])
            .setFooter({ text: auth!.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp(new Date(rewards.lastClaimDate));

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
