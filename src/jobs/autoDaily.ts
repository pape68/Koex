import { WebhookClient } from 'discord.js';
import composeMcp from '../api/mcp/composeMcp';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import { AutoDaily } from '../typings/supabase';
import createEmbed from '../utils/commands/createEmbed';
import refreshAuthData from '../utils/commands/refreshAuthData';
import supabase from '../utils/functions/supabase';

const startAutoDailyJob = async (client: ExtendedClient) => {
    const { data: accounts } = await supabase.from<AutoDaily>('auto_daily').select('*');

    if (!accounts || !accounts.length) return;

    accounts.forEach(async (account) => {
        const auth = await refreshAuthData(account.user_id);

        if (!auth) return;

        await composeMcp(auth, 'campaign', 'ClaimLoginReward');

        const webhookClient = new WebhookClient({
            id: process.env.AUTODAILY_WEBHOOK_ID!,
            token: process.env.AUTODAILY_WEBHOOK_TOKEN!
        });

        webhookClient.send({
            username: client.user?.username,
            avatarURL: client.user?.displayAvatarURL(),
            embeds: [createEmbed('info', `Attempted to claim daily login reward for **${account.user_id}**.`)]
        });
    });
};

export default startAutoDailyJob;
