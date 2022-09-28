import { APIEmbedField, EmbedBuilder, WebhookClient } from 'discord.js';

import composeMcp from '../api/mcp/composeMcp';
import { Color } from '../constants';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import createAuthData from '../utils/commands/createAuthData';
import { getAllAccounts, getAllAuths, getAllAutoDailyUsers } from '../utils/functions/database';
import { CampaignProfileData } from '../utils/helpers/operationResources';
import rewardData from '../utils/helpers/rewards.json' assert { type: 'json' };
import createEmbed from '../utils/commands/createEmbed';

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
            const accounts = await getAllAccounts(user.user_id);

            const fields: APIEmbedField[] = [];

            if (!accounts || !accounts.auths) {
                await webhookClient.send({
                    ...webhookOptions,
                    content: `<@!${user.user_id}>`,
                    embeds: [createEmbed('info', 'You have been logged out.')]
                });
                return;
            }

            for (const auth of accounts.auths) {
                const bearerAuth = await createAuthData(user.user_id, auth.accountId);

                if (!bearerAuth) {
                    fields.push({
                        name: auth.displayName,
                        value: 'Failed to retrieve authorization data.'
                    });
                    return;
                }

                const campaignProfile = await composeMcp<CampaignProfileData>(
                    bearerAuth,
                    'campaign',
                    'ClaimLoginReward'
                );

                const rewards = campaignProfile.profileChanges[0].profile.stats.attributes.daily_rewards as Required<
                    CampaignProfileData['daily_rewards']
                >;

                const { totalDaysLoggedIn } = rewards;

                fields.push({
                    name: `${bearerAuth.displayName}'s Reward ${
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
