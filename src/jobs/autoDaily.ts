import { APIEmbedField, EmbedBuilder, WebhookClient } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { Color } from '../constants';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import createAuthData from '../utils/commands/createAuthData';
import { getAllAccounts, getAllAutoDailyUsers } from '../utils/functions/database';
import { CampaignProfileData } from '../utils/helpers/operationResources';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };

const startAutoDailyJob = async (client: ExtendedClient) => {
    const users = await getAllAutoDailyUsers();

    if (!users.length) return;

    const webhookClient = new WebhookClient({
        id: process.env.AUTODAILY_WEBHOOK_ID!,
        token: process.env.AUTODAILY_WEBHOOK_TOKEN!
    });

    const webhookOptions = {
        username: client.user?.username,
        avatarURL: client.user?.displayAvatarURL()
    };

    for (const user of users) {
        setTimeout(async () => {
            const { auths } = await getAllAccounts(user.user_id);

            const fields: APIEmbedField[] = [];

            for (const oldAuth of auths) {
                const newAuth = await createAuthData(user.user_id, oldAuth.accountId);

                if (!newAuth) {
                    fields.push({
                        name: oldAuth.displayName,
                        value: 'Failed to retrieve authorization data.'
                    });
                    return;
                }

                const campaignProfile = await composeMcp<CampaignProfileData>(newAuth, 'campaign', 'ClaimLoginReward');

                const rewards = campaignProfile.profileChanges[0].profile.stats.attributes.daily_rewards as Required<
                    CampaignProfileData['daily_rewards']
                >;

                const { totalDaysLoggedIn } = rewards;

                fields.push({
                    name: `${newAuth.displayName}'s Reward ${
                        campaignProfile.notifications[0].items?.length === 0 ? '(Already Claimed)' : ''
                    }`,
                    value: `\`${totalDaysLoggedIn}\` **${(rewardData as any)[totalDaysLoggedIn % 336]}**`
                });
            }

            if (!fields.length) return;

            const embed = new EmbedBuilder().setColor(Color.GRAY).setFields(fields).setTimestamp();

            await webhookClient.send({
                ...webhookOptions,
                content: `<@!${user.user_id}>`,
                embeds: [embed]
            });
        }, 0 * 1000);
    }
};

export default startAutoDailyJob;
