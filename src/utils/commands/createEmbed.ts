import { EmbedBuilder, HexColorString } from 'discord.js';

import { Color, Emoji } from '../../constants';

type embedType = 'error' | 'info' | 'success';

const colors: Record<embedType, HexColorString> = {
    error: Color.red,
    info: Color.blue,
    success: Color.green
};

const emojis: Record<embedType, string> = {
    error: Emoji.cross,
    info: Emoji.info,
    success: Emoji.check
};

const createEmbed = (type: embedType, description: string) => {
    return new EmbedBuilder().setColor(colors[type]).setDescription(`${emojis[type]} ${description}`);
};

export default createEmbed;
