import { EmbedBuilder, HexColorString } from 'discord.js';
import { COLORS, EMOJI_URLS } from '../../constants';

type embedType = 'error' | 'info' | 'success';

const colors: Record<embedType, HexColorString> = {
    error: COLORS.red,
    info: COLORS.blue,
    success: COLORS.green
};

const emojis: Record<embedType, string> = {
    error: EMOJI_URLS.error,
    info: EMOJI_URLS.info,
    success: EMOJI_URLS.success
};

const createEmbed = (
    type: embedType,
    description?: string | null,
    customEmojiUrl?: string | null
) => {
    return new EmbedBuilder().setColor(colors[type]).setAuthor({
        name: description ?? 'No description provided.',
        iconURL: customEmojiUrl ?? emojis[type]
    });
};

export default createEmbed;
