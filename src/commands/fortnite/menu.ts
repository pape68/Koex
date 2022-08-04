import axios from 'axios';
import { ApplicationCommandType, ChatInputCommandInteraction } from 'discord.js';
import { menuComponents, menuEmbed } from '../../constants';

import { Command } from '../../interfaces/Command';
import Bot from '../../structures/Bot';

const fortniteIOSGameClient = {
    id: '3446cd72694c4a4485d81b77adbb2141',
    secret: '9209d4a5e25a457fb9b07489d313b41a'
};

const execute: Command = async (client: Bot, interaction: ChatInputCommandInteraction) => {
    const baseInstance = {
        baseURL: 'https://account-public-service-prod.ol.epicgames.com',
        method: 'POST'
    };

    const basicInstance = axios.create({
        ...baseInstance,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                fortniteIOSGameClient.id + ':' + fortniteIOSGameClient.secret
            ).toString('base64')}`
        }
    });

    const { data, error: selectError } = await client.supabase
        .from('fortnite')
        .select('*')
        .eq('user_id', interaction.user.id)
        .single();

    const loggedIn = data && data.account_id;

    const embed = menuEmbed.setAuthor({ name: 'Not Logged In' });

    if (loggedIn) {
        if (selectError) {
            client.logger.error(selectError);
            return interaction.reply(
                'An error occurred while trying to retrieve your account data.'
            );
        }

        const { account_id, device_id, secret } = data;

        const deviceAuthParams = new URLSearchParams({
            grant_type: 'device_auth',
            account_id,
            device_id,
            secret
        });

        await basicInstance
            .post(`/account/api/oauth/token`, deviceAuthParams.toString())
            .then((res) => {
                embed.setAuthor({
                    name: res.data.displayName,
                    iconURL: interaction.user.avatarURL() ?? undefined
                });
            })
            .catch((err) => {
                client.logger.error(err);
                return interaction.reply('Failed to log you back in.');
            });
    }

    interaction.reply({
        embeds: [embed],
        components: loggedIn ? menuComponents.loggedIn : menuComponents.loggedOut
    });
};

execute.options = {
    name: 'menu',
    description: '🔮',
    type: ApplicationCommandType.ChatInput
};

export default execute;
