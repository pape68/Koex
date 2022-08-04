import {
    ActionRowData,
    ButtonStyle,
    ClientOptions,
    ComponentData,
    ComponentType,
    EmbedBuilder,
    GatewayIntentBits,
    LinkButtonComponentData,
    MessageActionRowComponentData
} from 'discord.js';
import { bot } from '.';
import { Colors } from './types/constants';

export const HOME_GUILD_ID = '938428007377403924';
export const COMMANDS_CHANNEL = '1004260424386093238';

export const CLIENT_OPTIONS: ClientOptions = {
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
};

export const COLORS: Colors = {
    red: '#e62d64',
    orange: '#e4664d',
    yellow: '#f0c048',
    green: '#62CB51',
    blue: '#44a8fa',
    pink: '#f37ffe',
    gray: '#2f3136'
};

export const fortniteIOSGameClient = {
    id: '3446cd72694c4a4485d81b77adbb2141',
    secret: '9209d4a5e25a457fb9b07489d313b41a'
};

export const getAuthCodeButton: LinkButtonComponentData = {
    label: 'Get Auth Code',
    style: ButtonStyle.Link,
    url: `https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%3D${fortniteIOSGameClient.id}%26responseType%3Dcode%0A`,
    type: ComponentType.Button
};

export const menuEmbed = new EmbedBuilder().setColor(COLORS.blue).addFields({
    name: 'Main Menu',
    value: 'Use the buttons below to navigate the menu and performs actions.'
});

export const menuComponents = {
    loggedIn: [] as ActionRowData<MessageActionRowComponentData>[],
    loggedOut: [] as ActionRowData<MessageActionRowComponentData>[]
};
