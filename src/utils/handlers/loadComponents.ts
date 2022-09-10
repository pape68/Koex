import { join } from 'node:path';

import glob from 'glob';

import { isProd } from '../../constants';
import { Component, ComponentInteraction } from '../../interfaces/Component';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const loadComponents = async (client: ExtendedClient) => {
    const files = glob.sync(`${isProd ? 'dist' : 'src'}/components/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const url = new URL('file:///' + path);
        const interaction: Component<ComponentInteraction> = (await import(url.href)).default;

        client.interactions.set(interaction.name, interaction);
    }
};

export default loadComponents;
