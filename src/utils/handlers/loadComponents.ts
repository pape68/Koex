import { sync } from 'glob';
import { join } from 'path';

import { Component, ComponentInteraction } from '../../interfaces/Component';
import { ExtendedClient } from '../../interfaces/ExtendedClient';

const loadComponents = (client: ExtendedClient) => {
    const files = sync('src/components/**/*.ts');

    for (const file of files) {
        const path = join(process.cwd(), file);
        const interaction: Component<ComponentInteraction> = require(path).default;

        client.interactions.set(interaction.name, interaction);
    }
};

export default loadComponents;
