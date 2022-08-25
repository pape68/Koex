module.exports = {
    apps: [
        {
            name: 'koex',
            script: 'node',
            args: '-r dotenv/config dist/index.js',
            instances: 1,
            env_production: {
                NODE_ENV: 'production'
            },
            env_development: {
                NODE_ENV: 'development'
            },
            out_file: 'logs/out.log',
            error_file: 'logs/err.log'
        }
    ]
};
