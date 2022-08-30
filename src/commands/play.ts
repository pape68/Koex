import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import { DiscordGatewayAdapterCreator } from '@discordjs/voice';
import ytdl from 'ytdl-core';

import { Command } from '../interfaces/Command';
import { ExtendedClient } from '../interfaces/ExtendedClient';
import createEmbed from '../utils/commands/createEmbed';
import play from '../utils/music/play';

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

        if (!channel) {
            return interaction.editReply({ embeds: [createEmbed('error', "Couldn't find your voice channel.")] });
        }

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
    options: [
        {
            name: 'song-url',
            description: 'song',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ]
};

export default command;
