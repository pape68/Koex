import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import createOperationRequest from '../api/mcp/createOperationRequest';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

import { MCPResponse } from '../api/mcp/createOperationRequest';
import { COLORS } from '../constants';
import getCosmetic from '../utils/commands/getCosmetic';
import rewardData from '../utils/helpers/rewards.json';

export interface Attributes {
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

        const dateNow = new Date();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) {
            await interaction.editReply(defaultResponses.loggedOut);
            return;
        }

        const queryProfileRes = await createOperationRequest(auth, 'campaign', 'QueryProfile');

        if (queryProfileRes.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + queryProfileRes.error.message + '`')]
            });
            return;
        }

        const oldInfo = (queryProfileRes.data as MCPResponse<Attributes>).profileChanges[0].profile
            .stats.attributes.daily_rewards;

        const claimLoginRewardRes = await createOperationRequest(
            auth,
            'campaign',
            'ClaimLoginReward'
        );

        if (claimLoginRewardRes.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + claimLoginRewardRes.error.message + '`')]
            });
            return;
        }

        const newInfo = (claimLoginRewardRes.data as MCPResponse<Attributes>).profileChanges[0]
            .profile.stats.attributes.daily_rewards;

        const oldClaimDate = new Date(oldInfo.lastClaimDate);
        const newClaimDate = new Date(newInfo.lastClaimDate);

        let currentReward = newInfo.nextDefaultReward;

        const rewards = [`\`${currentReward}\` **${(rewardData as any)[currentReward]}**`];

        for (let i = 1; i < 6; i++) {
            if (currentReward + i === 336) currentReward = 0;
            rewards.push(`\`${currentReward + i}\` **${(rewardData as any)[currentReward + i]}**`);
        }

        const cosmeticUrl = await getCosmetic(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(COLORS.yellow)
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
            .setFooter({ text: auth.displayName, iconURL: cosmeticUrl ?? undefined })
            .setTimestamp(newClaimDate);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
