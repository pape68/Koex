import { join } from 'node:path';

import glob from 'glob';

import { IS_PROD } from '../../constants';
import { Component, ComponentInteraction } from '../../interfaces/Component';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const loadComponents = async (client: ExtendedClient) => {
    const files = glob.sync(`${IS_PROD ? 'dist' : 'src'}/components/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const url = new URL('file:///' + path);
        const interaction: Component<ComponentInteraction> = (await import(url.href)).default;

        if (interaction.name.includes('-')) {
            throw new Error('are you a retard');
        }

        client.components.set(interaction.name, interaction);
    }
};

export default loadComponents;
