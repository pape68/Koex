import { ClientOptions, GatewayIntentBits, HexColorString } from 'discord.js';

export const HOME_GUILD_ID = '938428007377403924';
export const COMMANDS_CHANNEL = '1004260424386093238';

// Discord.JS Options

export const CLIENT_OPTIONS: ClientOptions = {
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
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

// export const WHITELIST = []

export const FORTNITE_GAME_CLIENT = {
    id: '3446cd72694c4a4485d81b77adbb2141',
    secret: '9209d4a5e25a457fb9b07489d313b41a'
};

export const FORTNITE_BASIC_AUTH = `Basic ${btoa(
    FORTNITE_GAME_CLIENT.id + ':' + FORTNITE_GAME_CLIENT.secret
)}`;
