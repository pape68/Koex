import { CreateVoiceConnectionOptions, JoinVoiceChannelOptions } from '@discordjs/voice';

export interface Song {
    title: string;
    url: string;
}

export type ConnectionOptions = JoinVoiceChannelOptions & CreateVoiceConnectionOptions;

export interface Queue extends ConnectionOptions {
    songs: Song[];
    volume: number;
    playing: boolean;
}
