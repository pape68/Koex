import { codeBlock, EmbedBuilder, HexColorString } from 'discord.js';

import { Color, Emoji } from '../../constants';

type embedType = 'error' | 'info' | 'success';

const colors: Record<embedType, HexColorString> = {
    error: Color.RED,
    info: Color.BLUE,
    success: Color.GREEN
};

const emojis: Record<embedType, string> = {
    error: Emoji.CROSS,
    info: Emoji.INFO,
    success: Emoji.CHECK
};

const createEmbed = (type: embedType, description: string) => {
    if (type === 'error') {
        return new EmbedBuilder()
            .setColor(Color.RED)
            .setTitle(`${Emoji.CROSS} Hmm... That wasn't supposed to happen`)
            .setDescription(codeBlock(description))
            .setFields({
                name: 'Need help?',
                value: 'Talk to us in our [support server](https://discord.gg/koex).'
            });
    }

    return new EmbedBuilder().setColor(colors[type]).setDescription(`${emojis[type]} ${description}`);
};

export default createEmbed;
