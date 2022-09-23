import { APIEmbedField, EmbedBuilder, WebhookClient } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { Color } from '../constants';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import { Accounts, AutoDaily, SlotData } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import supabase from '../utils/functions/supabase';
import { CampaignProfileData } from '../utils/helpers/operationResources';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };

const startAutoDailyJob = async (client: ExtendedClient) => {
    const { data: enrollees } = await supabase.from<AutoDaily>('auto_daily').select('*');

    if (!enrollees || !enrollees.length) return;

    const webhookClient = new WebhookClient({
        id: process.env.AUTODAILY_WEBHOOK_ID!,
        token: process.env.AUTODAILY_WEBHOOK_TOKEN!
    });

    const webhookOptions = {
        username: client.user?.username,
        avatarURL: client.user?.displayAvatarURL()
    };

    for (const enrollee of enrollees) {
        setTimeout(async () => {
            const { data: account } = await supabase
                .from<Accounts>('accounts_test')
                .select('*')
                .match({ user_id: enrollee.user_id })
                .maybeSingle();

            const slotIndicies = Object.entries(account ?? {})
                .filter(([k, v]) => k.startsWith('slot_') && v)
                .map(([k]) => parseInt(k.split('_')[1]));

            const fields: APIEmbedField[] = [];

            for (const idx of slotIndicies) {
                const auth = await refreshAuthData(enrollee.user_id, idx);

                if (!auth) {
                    await webhookClient.send({
                        ...webhookOptions,
                        content: `<@!${enrollee.user_id}>`,
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
                    fields.push({
                        name: `${auth.displayName}'s Reward`,
                        value: claimLoginRewardResponse.error?.errorMessage ?? 'An unknown error occurred.'
                    });
                    continue;
                }

                const rewards = claimLoginRewardResponse.data.profileChanges[0].profile.stats.attributes
                    .daily_rewards as Required<CampaignProfileData['daily_rewards']>;

                const { totalDaysLoggedIn } = rewards;

                fields.push({
                    name: `${auth.displayName}'s Reward ${
                        claimLoginRewardResponse.data.notifications[0].items?.length === 0 ? '(Already Claimed)' : ''
                    }`,
                    value: `\`${totalDaysLoggedIn}\` **${(rewardData as any)[totalDaysLoggedIn % 336]}**`
                });
            }

            if (!fields.length) return;

            const embed = new EmbedBuilder().setColor(Color.GRAY).setFields(fields).setTimestamp();

            await webhookClient.send({
                ...webhookOptions,
                content: `<@!${enrollee.user_id}>`,
                embeds: [embed]
            });
        }, 0 * 1000);
    }
};

export default startAutoDailyJob;
