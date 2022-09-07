import { ClientOptions, GatewayIntentBits, HexColorString, ShardingManagerMode } from 'discord.js';
import { AuthClients } from './api/types';

// Discord.js Options

export const CLIENT_OPTIONS: ClientOptions = {
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    shards: 'auto'
};

// General

export const AUTODAILY_WH = {
    id: '1016879424395817010',
    token: '1ZM5-D8a4dYxYu3uaybKZPCbgutd6GYZGbahPqt2udUn5qdFcMRhS68Rk80JDhfwriG-'
};

export const IS_PROD = process.env.NODE_ENV === 'production';

export const COLORS: Record<string, HexColorString> = {
    red: '#e62d64',
    orange: '#F8602C',
    yellow: '#fadc44',
    green: '#04d46c',
    blue: '#44a8fa',
    pink: '#f37ffe',
    gray: '#2f3136'
};

export const EMOJIS = {
    error: '<:KX_Error:1007835165764112394>',
    info: '<:KX_Info:1007846233198563339>',
    success: '<:KX_Success:1007848246531608697>'
};

const emojiBaseUrl = 'https://cdn.discordapp.com/emojis/';
export const EMOJI_URLS = {
    error: emojiBaseUrl + '1007835165764112394',
    info: emojiBaseUrl + '1007846233198563339',
    success: emojiBaseUrl + '1007848246531608697'
};

// Fortnite

export const WHITELISTED_SERVERS = ['1004858701305368617', '1011405334516092928'];

interface FortniteClient {
    client: keyof typeof AuthClients;
    id: string;
    secret: string;
}

export const FORTNITE_CLIENT: FortniteClient = {
    client: 'fortniteIOSGameClient',
    id: atob(AuthClients.fortniteIOSGameClient).split(':')[0],
    secret: atob(AuthClients.fortniteIOSGameClient).split(':')[1]
};

export const FORTNITE_BASIC_AUTH = `Basic ${AuthClients.fortniteIOSGameClient}`;
