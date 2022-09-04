import { join } from 'node:path';

import glob from 'glob';

import { IS_PROD } from '../../constants';
import { Component, ComponentInteraction } from '../../interfaces/Component';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const loadComponents = async (client: ExtendedClient) => {
    const files = glob.sync(`${IS_PROD ? 'dist' : 'src'}/components/**/*.{js,ts}`);

    for (const file of files) {
        const path = join(process.cwd(), file);
        const interaction: Component<ComponentInteraction> = (await import(path)).default;

        client.interactions.set(interaction.name, interaction);
    }
};

export default loadComponents;
