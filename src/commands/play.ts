import {
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    NoSubscriberBehavior
} from '@discordjs/voice';
import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

import { Command } from '../interfaces/Command';
import ytdl from 'ytdl-core';
import { join } from 'path';
import createEmbed from '../utils/commands/createEmbed';

const command: Command = {
    name: 'play',
    description: "Retrieve's the bots latency.",
    type: ApplicationCommandType.ChatInput,
    execute: async (interaction) => {
        await interaction.deferReply();

        const name = interaction.options.getString('song')!;

        const member = interaction.guild!.members.cache.get(interaction.user.id);

        const { channel } = member!.voice;

        if (!channel) return interaction.editReply('no vc');

        const songInfo = await ytdl.getInfo(name);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });

        const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly' }));

        player.play(resource);

        connection.subscribe(player);

        await interaction.editReply({
            embeds: [createEmbed('info', `Now Playing: **${song.title}**`)]
        });
    },
    options: [{ name: 'song', description: 'song', type: ApplicationCommandOptionType.String }]
};

export default command;
