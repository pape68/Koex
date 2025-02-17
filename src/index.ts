import 'dotenv/config';

import process from 'node:process';

import { Client, ClientOptions, Collection, GatewayIntentBits } from 'discord.js';
import LRU from 'lru-cache';

import { ExtendedClient } from './interfaces/ExtendedClient';
import loadEvents from './utils/handlers/loadEvents';
import validateEnv from './utils/validators/validateEnv';

const clientOptions: ClientOptions = {
    allowedMentions: { parse: ['users'] },
    intents: [GatewayIntentBits.Guilds],
    partials: []
};

const client = new Client(clientOptions) as ExtendedClient;
client.cache = new LRU({ max: 1 });
client.commands = new Collection();
client.components = new Collection();

validateEnv();

client.login();

(async () => {
    await loadEvents(client);
})();

process.on('SIGINT', (signal) => {
    console.log(`Process ${process.pid} received a ${signal} signal`);
    process.exit(0);
});

process.on('exit', (code) => {
    console.info(`Process exited with code ${code}`);
});

process.on('uncaughtException', (err, origin) => {
    console.log('Uncaught Exception:', err, `\nOrigin: ${origin}`);
});

process.on('unhandledRejection', (reason: any, promise) => {
    console.log('Unhandled Rejection:', promise, `\nReason: ${reason.message}`);
});
