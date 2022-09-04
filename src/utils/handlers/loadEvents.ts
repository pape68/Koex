import { join } from 'node:path';

import glob from 'glob';

import { IS_PROD } from '../../constants';
import { Event } from '../../interfaces/Event';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const loadEvents = async (client: ExtendedClient) => {
    const files = glob.sync(`${IS_PROD ? 'dist' : 'src'}/events/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const event: Event = (await import(path)).default;
        const name = event.name ?? file.split('/').pop()!.split('.')[0];

        client[event.once ? 'once' : 'on'](name, event.execute.bind(null, client));
    }
};

export default loadEvents;
