import { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import createOperationRequest from '../api/mcp/createOperationRequest';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

import rewardData from '../utils/helpers/rewards.json';
import { MCPResponse } from '../api/mcp/createOperationRequest';
import getCosmetic from '../utils/commands/getCosmetic';
import { COLORS } from '../constants';

export interface LoginRewardResponse extends MCPResponse {
    profileChanges: ProfileChange[];
}

export interface ProfileChange {
    profile: Profile;
}

export interface Profile {
    stats: Stats;
}

export interface Stats {
    attributes: Attributes;
}

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
    description: "Claim's today's Fortnite Login Reward.",
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const dateNow = new Date();

        const auth = await refreshAuthData(interaction.user.id);

        if (!auth) return interaction.editReply(defaultResponses.loggedOut);

        const { data, error } = await createOperationRequest(auth, 'campaign', 'ClaimLoginReward');

        if (error) {
            return interaction.editReply({
                embeds: [createEmbed('error', '`' + error.message + '`')]
            });
        }

        const info = (data as LoginRewardResponse).profileChanges[0].profile.stats.attributes
            .daily_rewards;

        const claimDate = new Date(info.lastClaimDate);

        let currentReward = info.nextDefaultReward;

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
                        dateNow.getUTCDate() === claimDate.getUTCDate() ? '(Already Claimed)' : ''
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
            .setTimestamp(claimDate);

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
