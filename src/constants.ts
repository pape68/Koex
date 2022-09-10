import { AuthClients } from './api/types';

export enum Color {
    red = '#FA4459',
    orange = '#F8602C',
    yellow = '#fadc44',
    green = '#04d46c',
    blue = '#44a8fa',
    pink = '#f37ffe',
    gray = '#2f3136'
}

export enum Emoji {
    check = '<:KX_Check:1017236824621596732>',
    cross = '<:KX_Cross:1017236826223808602>',
    info = '<:KX_Info:1017236827507265547>'
}

interface FortniteClient {
    name: keyof typeof AuthClients;
    id: string;
    secret: string;
}

const client: FortniteClient['name'] = 'fortniteIOSGameClient';
const [id, secret] = Buffer.from(AuthClients[client], 'base64').toString().split(':');
export const fortniteClient: FortniteClient = { name: client, id, secret };

export const isProd = process.env.NODE_ENV === 'production';
