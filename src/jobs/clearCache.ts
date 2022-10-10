import { ExtendedClient } from '../interfaces/ExtendedClient';

export const deleteCatalogCache = async (client: ExtendedClient) => {
    client.cache.delete('catalog');
};
