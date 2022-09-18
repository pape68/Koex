import { EmbedBuilder, WebhookClient } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { Color } from '../constants';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import { AutoDaily } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import supabase from '../utils/functions/supabase';
import { CampaignProfileData } from '../utils/helpers/operationResources';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };

const startAutoDailyJob = async (client: ExtendedClient) => {
    const { data: accounts } = await supabase.from<AutoDaily>('auto_daily').select('*');

    if (!accounts || !accounts.length) return;

    const webhookClient = new WebhookClient({
        id: process.env.AUTODAILY_WEBHOOK_ID!,
        token: process.env.AUTODAILY_WEBHOOK_TOKEN!
    });

    const webhookOptions = {
        username: client.user?.username,
        avatarURL: client.user?.displayAvatarURL()
    };

    for (const account of accounts) {
        setTimeout(async () => {
            const auth = await refreshAuthData(account.user_id);

            if (!auth) {
                await webhookClient.send({
                    ...webhookOptions,
                    content: `<@!${account.user_id}>`,
                    embeds: [createEmbed('error', `Failed to retrieve account data.`)]
                });
                return;
            }

            const claimLoginRewardResponse = await composeMcp<CampaignProfileData>(
                auth,
                'campaign',
                'ClaimLoginReward'
            );

            if (!claimLoginRewardResponse.data || claimLoginRewardResponse.error) {
                await webhookClient.send({
                    ...webhookOptions,
                    content: `<@!${account.user_id}>`,
                    embeds: [createEmbed('error', `Failed to retrieve daily reward data.`)]
                });
                return;
            }

            const rewards = claimLoginRewardResponse.data.profileChanges[0].profile.stats.attributes
                .daily_rewards as Required<CampaignProfileData['daily_rewards']>;

            const nextReward = rewards.nextDefaultReward % 336;

            const embed = new EmbedBuilder()
                .setColor(Color.GRAY)
                .addFields([
                    {
                        name: `Today's Reward ${
                            claimLoginRewardResponse.data.notifications[0].items?.length === 0
                                ? '(Already Claimed)'
                                : ''
                        }`,
                        value: `\`${nextReward}\` **${(rewardData as any)[nextReward]}**`
                    }
                ])
                .setTimestamp();

            await webhookClient.send({
                ...webhookOptions,
                content: `<@!${account.user_id}>`,
                embeds: [embed]
            });
        }, 30 * 1000);
    }
};

export default startAutoDailyJob;
