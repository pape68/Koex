import { GiveawaysManagerOptions } from 'discord-giveaways';
import { ClientOptions, GatewayIntentBits } from 'discord.js';
import { Colors } from './types/constants';

export const HOME_GUILD_ID = '938428007377403924';

export const CLIENT_OPTIONS: ClientOptions = {
    intents: [
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
