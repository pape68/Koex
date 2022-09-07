import createEmbed from '../commands/createEmbed';

export default {
    loggedOut: {
        embeds: [createEmbed('info', 'You are not logged.')],
        ephemeral: true
    },
    authError: {
        embeds: [createEmbed('error', 'An error occurred while authenticating.')],
        ephemeral: true
    }
};
