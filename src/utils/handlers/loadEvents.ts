import { join } from 'node:path';

import glob from 'glob';

import { isProd } from '../../constants';
import { Event } from '../../interfaces/Event';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const loadEvents = async (client: ExtendedClient) => {
    const files = glob.sync(`${isProd ? 'dist' : 'src'}/events/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const url = new URL('file:///' + path);
        const event: Event = (await import(url.href)).default;

        const name = event.name ?? file.split('/').pop()!.split('.')[0];

        client['on'](name, event.execute.bind(null, client));
    }
};

export default loadEvents;
