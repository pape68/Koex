import { setTimeout } from 'timers/promises';

import axios from 'axios';
import {
    ApplicationCommandType,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    MessageComponentInteraction
} from 'discord.js';
import { COLORS } from '../../constants';

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

    const instance = axios.create({
        ...baseInstance,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                fortniteIOSGameClient.id + ':' + fortniteIOSGameClient.secret
            ).toString('base64')}`
        }
    });

    const { data, error } = await client.supabase
        .from('fortnite')
        .select('*')
        .eq('user_id', interaction.user.id)
        .single();

    const loggedOut = !data;

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Not Signed In' })
        .setColor(COLORS.blue)
        .addFields({
            name: 'Main Menu',
            value: 'Use the buttons below to navigate the menu and performs actions.'
        });

    if (data) {
        const { account_id, device_id, secret } = data;

        const params2 = new URLSearchParams({
            grant_type: 'device_auth',
            account_id,
            device_id,
            secret
        });

        const res = await instance.post(`/account/api/oauth/token`, params2.toString());

        embed.setAuthor({
            name: res.data.displayName,
            iconURL: interaction.user.avatarURL() ?? undefined
        });
    }

    interaction.reply({
        embeds: [embed],
        components: [
            !loggedOut
                ? {
                      type: ComponentType.ActionRow,
                      components: [
                          client.interactions.get('startdupe')!.options,
                          client.interactions.get('stopdupe')!.options,
                          client.interactions.get('logout')!.options
                      ]
                  }
                : {
                      type: ComponentType.ActionRow,
                      components: [
                          {
                              label: 'Get Auth Code',
                              style: ButtonStyle.Link,
                              url: `https://www.epicgames.com/id/api/redirect?clientId=${fortniteIOSGameClient.id}&responseType=code`,
                              type: ComponentType.Button
                          },
                          client.interactions.get('login')!.options
                      ]
                  }
        ]
    });
};

execute.options = {
    name: 'menu',
    description: '🔮',
    type: ApplicationCommandType.ChatInput
};

export default execute;
