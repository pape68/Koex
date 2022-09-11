import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import composeMcp from '../api/mcp/composeMcp';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

import { MCPResponse } from '../api/mcp/composeMcp';
import { Color } from '../constants';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };

export interface LoginRewardAttributes {
    daily_rewards: DailyRewards;
}

export interface DailyRewards {
    nextDefaultReward: number;
    totalDaysLoggedIn: number;
    lastClaimDate: string;
    additionalSchedules: any;
}

const command: Command = {
    name: 'claim-daily',
    description: 'Claim your Save the World daily login reward.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const profile = await composeMcp(auth, 'campaign', 'QueryProfile');

        if (profile.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + profile.error.message + '`')]
            });
            return;
        }

        const oldInfo = (profile.data as MCPResponse<LoginRewardAttributes>).profileChanges[0].profile.stats.attributes
            .daily_rewards;

        const login = await composeMcp(auth, 'campaign', 'ClaimLoginReward');

        if (login.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + login.error.message + '`')]
            });
            return;
        }

        const newInfo = (login.data as MCPResponse<LoginRewardAttributes>).profileChanges[0].profile.stats.attributes
            .daily_rewards;

        const oldClaimDate = new Date(oldInfo.lastClaimDate);
        const newClaimDate = new Date(newInfo.lastClaimDate);

        let currentReward = newInfo.nextDefaultReward;
        let currentReward2 = currentReward % 336;
        const rewards = [`\`${currentReward2}\` **${(rewardData as any)[currentReward2]}**`];

        for (let i = 1; i < 6; i++) {
            rewards.push(`\`${currentReward2 + i}\` **${(rewardData as any)[currentReward2 + i]}**`);
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.yellow)
            .addFields([
                {
                    name: `Today's Reward ${
                        oldClaimDate.getTime() === newClaimDate.getTime() ? '(Already Claimed)' : ''
                    }`,
                    value: rewards[0]
                },
                {
                    name: "Tomorrow's Reward",
                    value: rewards[1]
                },
                {
                    name: 'Upcoming Rewards',
                    value: rewards.slice(2).join('\n')
                }
            ])
            .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp(newClaimDate);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
