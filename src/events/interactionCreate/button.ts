import axios from 'axios';
import { ButtonInteraction } from 'discord.js';

import { Event } from '../../interfaces/Event';
import { fortniteIOSGameClient, menuComponents, menuEmbed } from '../../constants';
import { ExtendedClient } from '../../interfaces/ExtendedClient';
import { Button } from '../../interfaces/Button';

const event: Event = {
    execute: async (client: ExtendedClient, interaction: ButtonInteraction) => {
        if (!interaction.isButton() || interaction.guild) return;

        try {
            (client.interactions.get(interaction.customId) as Button).execute(client, interaction);
        } catch (err) {
            client.logger.error(err);
        }

        if (!['login', 'logout'].includes(interaction.customId)) {
            const { data, error: eqError } = await client.supabase
                .from('fortnite')
                .select('*')
                .eq('user_id', interaction.user.id)
                .single();

            if (data && data.access_token) {
                if (eqError) {
                    return client.logger.error(eqError);
                }

                const { account_id, device_id, secret } = data;

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

                const deviceAuthParams = new URLSearchParams({
                    grant_type: 'device_auth',
                    account_id,
                    device_id,
                    secret
                });

                await basicInstance
                    .post(`/account/api/oauth/token`, deviceAuthParams.toString())
                    .then(async (res) => {
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
                    })
                    .catch(async (err) => {
                        client.logger.error(err);

                        if (!interaction.deferred || !interaction.replied)
                            await interaction.deferReply({ ephemeral: true });

                        const { error: deleteError } = await client.supabase
                            .from('fortnite')
                            .delete()
                            .match({
                                user_id: interaction.user.id
                            });

                        if (deleteError) {
                            client.logger.error(deleteError);
                            return interaction.editReply('Failed to log you out.');
                        }

                        const embed = menuEmbed.setAuthor({ name: 'Not Logged In' });

                        interaction.user.createDM().then(() => {
                            interaction.message?.edit({
                                embeds: [embed],
                                components: menuComponents.loggedOut
                            });
                        });

                        interaction.editReply(
                            'Failed to refresh your credentials, please log back in.'
                        );
                    });
            }
        }
    },
    options: {
        name: 'interactionCreate'
    }
};

export default event;
