import { ExtendedClient } from '../../interfaces/ExtendedClient';
import { Event } from '../../interfaces/Event';
import { sync } from 'glob';
import { join } from 'path';

const loadEvents = (client: ExtendedClient) => {
    const isProd = process.env.NODE_ENV === 'production';

    const files = sync(`${isProd ? 'dist' : 'src'}/events/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const event: Event = require(path).default;
        const name = event.name ?? file.split('/').pop()!.split('.')[0];

        client[event.once ? 'once' : 'on'](name, event.execute.bind(null, client));
    }
};

export default loadEvents;
