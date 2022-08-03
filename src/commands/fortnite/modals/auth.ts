import {
    ComponentType,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    TextInputStyle
} from 'discord.js';

import Bot from '../../../structures/Bot';
import { Modal } from '../../../interfaces/Modal';
import axios from 'axios';
import { fortniteIOSGameClient } from '../../../constants';

const execute: Modal = async (client: Bot, interaction: ModalSubmitInteraction) => {
    interaction.deferReply({
        ephemeral: true
    });

    const code = interaction.fields.getTextInputValue('code');

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

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code
    });

    await instance
        .post('/account/api/oauth/token', params.toString())
        .then(async (res) => {
            const access_token = res.data.access_token;
            const account_id = res.data.account_id;
            const displayName = res.data.displayName;

            const instance2 = axios.create({
                ...baseInstance,
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            const deviceAuthRes = await instance2.post(
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

            const tokenRes = await instance.post(
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

            interaction.editReply(`You have been logged in as **${displayName}**.`);

            const filter = (i: MessageComponentInteraction) =>
                i.customId === 'login' && i.user.id === interaction.user.id;

            const collector = interaction.channel!.createMessageComponentCollector({
                filter,
                time: 15000
            });

            collector.on('collect', async (i) => {
                await i.editReply({ content: 'A button was clicked!', components: [] });
            });

            collector.on('end', (collected) => console.log(`Collected ${collected.size} items`));
        })
        .catch((err) => {
            if (err.response.data.numericErrorCode === 18059) {
                return interaction.editReply(
                    'You have entered an invalid code. Please try again as it may have expired.'
                );
            }
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
