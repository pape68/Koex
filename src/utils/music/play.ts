import {
    AudioPlayerState,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior
} from '@discordjs/voice';
import { ChatInputCommandInteraction, Collection } from 'discord.js';
import ytdl from 'ytdl-core';

import { ComponentInteraction } from '../../interfaces/Component';
import { Queue } from '../../types/index';
import createEmbed from '../commands/createEmbed';

const createYTDLResource = (url: string) =>
    createAudioResource(ytdl(url, { filter: 'audioonly', quality: 'lowestaudio' }));

const play = async (
    queue: Collection<string, Queue>,
    interaction: ChatInputCommandInteraction | ComponentInteraction
) => {
    const guildId = interaction.guildId!;
    const serverQueue = queue.get(guildId);

    if (!serverQueue) {
        queue.delete(guildId);
        return interaction.editReply({ embeds: [createEmbed('error', 'Failed to retrieve server queue.')] });
    }

    const { adapterCreator, channelId, playing } = serverQueue;

    if (playing) {
        const options = {
            embeds: [createEmbed('info', `Song added to queue.`)]
        };

        if (!interaction.replied) {
            return interaction.editReply(options);
        } else {
            return interaction.followUp(options);
        }
    }

    const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator
    });

    const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

    connection.subscribe(player);

    player.on('stateChange', (oldState: AudioPlayerState, newState: AudioPlayerState) => {
        if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
            serverQueue.songs.shift();
            queue.set(guildId, { ...serverQueue, playing: false });
            play(queue, interaction);
        }
    });

    if (!serverQueue.playing && serverQueue.songs) {
        if (!serverQueue.songs.length) {
            connection.disconnect();
            return interaction.editReply({ embeds: [createEmbed('info', 'Reached the end of the queue.')] });
        }
        player.play(createYTDLResource(serverQueue.songs[0].url));
        queue.set(guildId, { ...serverQueue, playing: true });
    }

    return interaction.editReply({ embeds: [createEmbed('info', `Now Playing: **${serverQueue.songs[0].title}**`)] });
};

export default play;
