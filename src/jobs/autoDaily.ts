import { EmbedBuilder, WebhookClient } from 'discord.js';

import composeMcp, { MCPResponse } from '../api/mcp/composeMcp';
import { LoginRewardAttributes } from '../commands/claimDaily';
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
                    embeds: [createEmbed('error', `Failed to retrieve account data for <@!${account.user_id}>.`)]
                });
                return;
            }

            const characterAvatarUrl = await getCharacterAvatar(account.user_id);

            const login = await composeMcp(auth, 'campaign', 'ClaimLoginReward');

            if (!login.data) {
                await webhookClient.send({
                    ...webhookOptions,
                    embeds: [createEmbed('error', `Failed to retrieve reward data for <@!${account.user_id}>.`)]
                });
                return;
            }

            const rewards = (login.data as MCPResponse<LoginRewardAttributes>).profileChanges[0].profile.stats
                .attributes.daily_rewards;

            let currentReward = rewards.nextDefaultReward;

            const embed = new EmbedBuilder()
                .setColor(Color.gray)
                .setDescription(`\`${currentReward}\` **${(rewardData as any)[currentReward]}**`)
                .setFooter({
                    text: auth.displayName,
                    iconURL: characterAvatarUrl ?? undefined
                });

            await webhookClient.send({
                ...webhookOptions,
                embeds: [embed]
            });
        }, 30 * 1000);
    }
};

export default startAutoDailyJob;
