require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', () => {
	console.log(client.guilds.cache.size);
	for (const g of client.guilds.cache) {
		console.log(g[1].name)
	}
});

client.login();
