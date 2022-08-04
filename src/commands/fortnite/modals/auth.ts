import { ComponentType, ModalSubmitInteraction, TextInputStyle } from 'discord.js';
import { setTimeout as wait } from 'timers/promises';

import Bot from '../../../structures/Bot';
import { Modal } from '../../../interfaces/Modal';
import axios from 'axios';
import { fortniteIOSGameClient, menuComponents, menuEmbed } from '../../../constants';

const execute: Modal = async (client: Bot, interaction: ModalSubmitInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const code = interaction.fields.getTextInputValue('code');

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

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code
    });

    await basicInstance
        .post('/account/api/oauth/token', params.toString())
        .then(async (res) => {
            const access_token = res.data.access_token;
            const account_id = res.data.account_id;
            const displayName = res.data.displayName;

            const bearerInstance = axios.create({
                ...baseInstance,
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            const deviceAuthRes = await bearerInstance.post(
                `/account/api/public/account/${account_id}/deviceAuth`,
                {}
            );

            const device_id = deviceAuthRes.data.deviceId;
            const secret = deviceAuthRes.data.secret;

            const deviceAuthParams = new URLSearchParams({
                grant_type: 'device_auth',
                account_id,
                device_id,
                secret
            });

            const tokenRes = await basicInstance.post(
                `/account/api/oauth/token`,
                deviceAuthParams.toString()
            );

            const { error } = await client.supabase
                .from('fortnite')
                .upsert({
                    user_id: interaction.user.id,
                    access_token: tokenRes.data.access_token,
                    account_id,
                    device_id,
                    secret
                })
                .single();

            if (error) {
                console.error(error);
                return interaction.editReply('An interal occurred. Please try again.');
            }

            const newLoginUrl = `https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%${fortniteIOSGameClient.id}%26responseType%3Dcode%0A&prompt=login`;
            interaction.editReply({
                content: `You have been logged in as **${displayName}**. [Click here to switch accounts](${newLoginUrl}).`,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [client.interactions.get('login')!.options]
                    }
                ]
            });

            const embed = menuEmbed.setAuthor({
                name: displayName,
                iconURL: interaction.user.avatarURL() ?? undefined
            });

            interaction.user.createDM().then(() => {
                interaction.message?.edit({
                    embeds: [embed],
                    components: menuComponents.loggedIn
                });
            });
        })
        .catch((err) => {
            if (err.response && err.response.data.numericErrorCode === 18059) {
                return interaction.editReply(
                    'You have entered an invalid code. Please try again as it may have expired.'
                );
            }
        })
        .catch((err) => {
            client.logger.error(err);
            return interaction.editReply(`Authentication failed.`);
        });
};

execute.options = {
    components: [
        {
            type: ComponentType.ActionRow,
            components: [
                {
                    customId: 'code',
                    label: 'Enter Auth Code',
                    style: TextInputStyle.Short,
                    type: ComponentType.TextInput,
                    required: true,
                    placeholder: '2bab1acab222ac12bc131bc2a31223a1',
                    minLength: 32,
                    maxLength: 32
                }
            ]
        }
    ],
    customId: 'auth',
    title: 'Login'
};

export default execute;
