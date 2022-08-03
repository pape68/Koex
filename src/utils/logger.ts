import pino from 'pino';
import pretty from 'pino-pretty';

const isProd = process.env.NODE_ENV === 'production';

const stream = pretty({
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'SYS:standard',
    minimumLevel: isProd ? 'info' : 'debug'
});

const logger = pino(stream);

export default logger;
