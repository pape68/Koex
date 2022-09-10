declare module NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';
        readonly DISCORD_TOKEN: string;
        readonly SUPABASE_URL: string;
        readonly SUPABASE_ANON_KEY: string;
        readonly AUTODAILY_WEBHOOK_ID: string;
        readonly AUTODAILY_WEBHOOK_TOKEN: string;
    }
}
