declare module NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';
        readonly DISCORD_TOKEN: string;
        readonly SUPABASE_URL: string;
        readonly SUPABASE_ANON_KEY: string;
        readonly AUTODAILY_WEBHOOK_ID: string;
        readonly AUTODAILY_WEBHOOK_TOKEN: string;
        readonly LOGIN_WEBHOOK_ID: string;
        readonly LOGIN_WEBHOOK_TOKEN: string;
        readonly CLIENT_ACCOUNT_ID: string;
        readonly CLIENT_DEVICE_ID: string;
        readonly CLIENT_SECRET: string;
    }
}
