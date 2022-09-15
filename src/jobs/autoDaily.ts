import { EmbedBuilder, WebhookClient } from 'discord.js';

import { ClaimLoginRewardResponse } from './../commands/claimDaily';
import composeMcp from '../api/mcp/composeMcp';
import { Color } from '../constants';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import { AutoDaily } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import getCharacterAvatar from '../utils/commands/getCharacterAvatar';
import refreshAuthData from '../utils/commands/refreshAuthData';
import supabase from '../utils/functions/supabase';
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

            const characterAvatarUrl = await getCharacterAvatar(account.user_id);
            const login = await composeMcp(auth, 'campaign', 'ClaimLoginReward');

            if (login.error) {
                await webhookClient.send({
                    ...webhookOptions,
                    content: `<@!${account.user_id}>`,
                    embeds: [createEmbed('error', `Failed to retrieve daily reward data.`)]
                });
                return;
            }

            const newInfo = (login.data as ClaimLoginRewardResponse).profileChanges[0].profile.stats.attributes
                .daily_rewards;

            let currentReward = newInfo.nextDefaultReward;

            const embed = new EmbedBuilder()
                .setColor(Color.gray)
                .addFields([
                    {
                        name: `Today's Reward ${
                            (login.data as ClaimLoginRewardResponse).notifications[0].items.length === 0
                                ? '(Already Claimed)'
                                : ''
                        }`,
                        value: `\`${currentReward}\` **${(rewardData as any)[currentReward]}**`
                    }
                ])
                .setFooter({ text: auth.displayName, iconURL: characterAvatarUrl ?? undefined })
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
