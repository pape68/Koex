import { EmbedBuilder, HexColorString } from 'discord.js';

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
    return new EmbedBuilder().setColor(colors[type]).setDescription(`${emojis[type]} ${description}`);
};

export default createEmbed;
