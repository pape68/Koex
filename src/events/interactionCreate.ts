import axios from 'axios';
import {
    ButtonInteraction,
    Interaction,
    InteractionType,
    ModalSubmitInteraction
} from 'discord.js';

import { Event } from '../interfaces/Event';
import { fortniteIOSGameClient } from '../constants';
import Bot from '../structures/Bot';

const execute: Event = async (client: Bot, interaction: Interaction) => {
    if (
        (!interaction.isChatInputCommand() &&
            !interaction.isButton() &&
            interaction.type !== InteractionType.ModalSubmit) ||
        !interaction.guild
    )
        return;

    try {
        interaction.isChatInputCommand()
            ? client.interactions.get(interaction.commandName)!(client, interaction)
            : client.interactions.get(interaction.customId)!(
                  client,
                  interaction as ButtonInteraction & ModalSubmitInteraction
              );
    } catch (err) {
        client.logger.error(err);
    }

    if (interaction.isButton()) {
        const { data, error: eqError } = await client.supabase
            .from('fortnite')
            .select('*')
            .eq('user_id', interaction.user.id)
            .single();

        if (!data) return;

        if (eqError) {
            return client.logger.error(eqError);
        }

        const { account_id, device_id, secret } = data;

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

        const params2 = new URLSearchParams({
            grant_type: 'device_auth',
            account_id,
            device_id,
            secret
        });

        const res = await instance.post(`/account/api/oauth/token`, params2.toString());

        const { error: upsertError } = await client.supabase
            .from('fortnite')
            .upsert({
                user_id: interaction.user.id,
                access_token: res.data.access_token,
                account_id,
                device_id,
                secret
            })
            .single();

        if (upsertError) {
            return client.logger.error(upsertError);
        }
    }
};

export default execute;
