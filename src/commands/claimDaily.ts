import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import composeMcp from '../api/mcp/composeMcp';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';

import { Color } from '../constants';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };
import { CampaignProfileData } from '../utils/helpers/operationResources';

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
        const campaignLogin = await composeMcp<CampaignProfileData>(auth, 'campaign', 'ClaimLoginReward');

        if (!campaignLogin.data || campaignLogin.error) {
            await interaction.editReply({
                embeds: [createEmbed('error', '`' + campaignLogin.error!.errorMessage + '`')]
            });
            return;
        }

        const rewards = campaignLogin.data.profileChanges[0].profile.stats.attributes.daily_rewards as Required<
            CampaignProfileData['daily_rewards']
        >;

        const { nextDefaultReward } = rewards;
        const rewardDescriptions = [`\`${nextDefaultReward % 336}\` **${(rewardData as any)[nextDefaultReward % 336]}**`];

        for (let i = 0; i < 5; i++) {
	    const nextReward = ((nextDefaultReward + i) % 336) + 1;
            rewardDescriptions.push(`\`${nextReward}\` **${(rewardData as any)[nextReward]}**`);
        }

        const characterAvatarUrl = await getCharacterAvatar(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(Color.YELLOW)
            .addFields([
                {
                    name: `Today's Reward ${
                        campaignLogin.data.notifications[0].items?.length === 0 ? '(Already Claimed)' : ''
                    }`,
                    value: rewardDescriptions[0]
                },
                {
                    name: "Tomorrow's Reward",
                    value: rewardDescriptions[1]
                },
                {
                    name: 'Upcoming Rewards',
                    value: rewardDescriptions.slice(2).join('\n')
                }
            ])
            .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
            .setTimestamp(new Date(rewards.lastClaimDate));

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
