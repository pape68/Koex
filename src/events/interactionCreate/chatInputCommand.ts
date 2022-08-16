import { Command } from '../../interfaces/Command';
import { Event } from '../../interfaces/Event';
import refreshUserData from '../../utils/functions/refreshUserData';

const event: Event = {
    name: 'interactionCreate',
    execute: async (client, interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName !== 'account') await refreshUserData(interaction.user.id);

        (client.interactions.get(interaction.commandName) as Command)
            .execute(interaction)
            .catch(error => console.error(error));
    }
};

export default event;
