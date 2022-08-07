import { SupabaseClient } from '@supabase/supabase-js';
import { Client, Collection } from 'discord.js';
import { Logger } from 'pino';

import { Button } from './Button';
import { Command } from './Command';
import { Modal } from './Modal';

export interface ExtendedClient extends Client {
    cooldowns: Collection<string, Collection<any, any>>;
    interactions: Collection<string, Button | Command | Modal>;
    logger: Logger;
    supabase: SupabaseClient;
}
