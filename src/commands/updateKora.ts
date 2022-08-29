import { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock } from 'discord.js';
import util from 'util';

import createExchangeCode from '../api/auth/createExchangeCode';
import { Command } from '../interfaces/Command';
import refreshAuthData from '../utils/commands/refreshAuthData';
import defaultResponses from '../utils/helpers/defaultResponses';
import createEmbed from '../utils/commands/createEmbed';

const command: Command = {
    name: 'restart-kora',
    description: 'Restarts the Koex utility bot Kora.',
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!['951989622236397590', '569212600785567777'].includes(interaction.user.id)) {
            return interaction.editReply({
                embeds: [createEmbed('info', 'You do not have permission to use this command.')]
            });
        }

        const exec = util.promisify((await import('child_process')).exec);

        await exec('cd /home/ubuntu/Kora');
        await exec('git pull');
        await exec('pm2 delete kora');
        await exec('pnpm start');
        const { stdout } = await exec('pm2 save');

        interaction.editReply({ content: codeBlock(stdout) });
    }
};

export default command;
