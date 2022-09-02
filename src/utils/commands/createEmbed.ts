import { EmbedBuilder, HexColorString } from 'discord.js';
import { COLORS, EMOJIS } from '../../constants';

type embedType = 'error' | 'info' | 'success';

const colors: Record<embedType, HexColorString> = {
    error: COLORS.red,
    info: COLORS.blue,
    success: COLORS.green
};

const emojis: Record<embedType, string> = {
    error: EMOJIS.error,
    info: EMOJIS.info,
    success: EMOJIS.success
};

const createEmbed = (type: embedType, description?: string | null, emoji = true) => {
    return new EmbedBuilder()
        .setColor(colors[type])
        .setDescription(
            `${emoji ? emojis[type] + ' ' : ''}${description ?? 'No description provided.'}`
        );
};

export default createEmbed;
