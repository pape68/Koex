import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

import { Command } from '../interfaces/Command';
import createEmbed from '../utils/commands/createEmbed';
import play from '../utils/music/play';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import { DiscordGatewayAdapterCreator } from '@discordjs/voice';
import ytdl from 'ytdl-core';

const command: Command = {
    name: 'play',
    description: "Retrieve's the bots latency.",
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const client = interaction.client as ExtendedClient;

        const url = interaction.options.getString('song-url')!;

        const member = interaction.guild!.members.cache.get(interaction.user.id);

        const { channel } = member!.voice;

        if (!channel) return interaction.editReply('no vc');

        const { videoDetails } = await ytdl.getInfo(url);

        const song = {
            title: videoDetails.title,
            url: videoDetails.video_url
        };

        const oldQueue = client.queue.get(channel.guildId);

        const songs = oldQueue?.songs ?? [];

        songs.push(song);

        const queue = client.queue.set(channel.guildId, {
            channelId: channel.id,
            guildId: interaction.guild!.id,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
            volume: 5,
            playing: oldQueue?.playing ?? false,
            songs
        });

        await play(queue, interaction);
    },
    options: [{ name: 'song-url', description: 'song', type: ApplicationCommandOptionType.String }]
};

export default command;
