require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.DISCORD_TOKEN;

const rest = new REST({ version: '10' }).setToken(token);
rest.get(Routes.applicationCommands('1004507554677796984')).then((data) => {
    const promises = [];
    for (const command of data) {
        const deleteUrl = `${Routes.applicationCommands('1004507554677796984')}/${command.id}`;
        promises.push(rest.delete(deleteUrl));
        console.log(command);
    }
    return Promise.all(promises);
});
