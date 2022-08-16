import { User } from 'discord.js';

const getDefaultPFP = (user: User) => {
    const num = parseInt(user.discriminator) % 5;
    return user.displayAvatarURL() ?? `https://cdn.discordapp.com/embed/avatars/${num}.png`;
};

export default getDefaultPFP;
