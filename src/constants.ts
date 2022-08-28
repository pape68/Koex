import { ClientOptions, GatewayIntentBits, HexColorString } from 'discord.js';
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
    ]
};

// General

export const COLORS: Record<string, HexColorString> = {
    red: '#e62d64',
    orange: '#fa8444',
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
