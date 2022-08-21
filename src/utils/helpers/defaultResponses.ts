import createEmbed from '../functions/createEmbed';

export default {
    loggedOut: {
        embeds: [createEmbed('info', 'You are not logged in to any accounts.')]
    },
    authError: {
        embeds: [createEmbed('error', 'An error occurred while authenticating.')]
    }
};
