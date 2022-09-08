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
    id: '1017223630163288125',
    token: 'I4YDBFRQF3x0tlD1hLV2L00m4SCT4cXuiEh5lXKyaCRobk8ouq6KGgN-MVt8V6wn0hpb'
};

export const IS_PROD = process.env.NODE_ENV === 'production';

export const COLORS: Record<string, HexColorString> = {
    red: '#FA4459',
    orange: '#F8602C',
    yellow: '#fadc44',
    green: '#04d46c',
    blue: '#44a8fa',
    pink: '#f37ffe',
    gray: '#2f3136'
};

export const EMOJIS = {
    check: '<:KX_Check:1017236824621596732>',
    cross: '<:KX_Cross:1017236826223808602>',
    info: '<:KX_Info:1017236827507265547>'
};

// Fortnite

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
