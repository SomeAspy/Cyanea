import { EmbedBuilder } from 'discord.js';
export const name = "ban"
export const description = "Bans a user from the server."
export const usage = "ban <user> [reason]"
export const permissions = "BAN_MEMBERS"
export const botPerms = "BAN_MEMBERS"
export const guildOnly = true
export async function execute(message, args) {
    const user = message.mentions.users.first();
    if (user) {
        const member = message.guild.members.resolve(user);
        console.log(args)
        console.log(member)
        if (member) {
            member
                .ban({
                    reason: args.slice(1).join(' '),
                })
                .then(() => {
                    if (reason == null) {
                        reason = "No reason provided."
                    }
                    const embed = new EmbedBuilder()
                        .setTitle('User Banned')
                        .setDescription(`${user.tag} has been banned from the server with reason \`${args.slice(1).join(' ')}\``)
                        .setColor('#ff0000')
                        .setTimestamp()
                        .setFooter(`Banned by ${message.author.username}`, message.author.displayAvatarURL());
                    message.channel.send({ embeds: [embed] });
                })
                .catch(err => {
                    message.reply('I was unable to ban the member');
                    console.error(err);
                });
        } else {
            message.reply("That user isn't in this guild!");
        }
    } else {
        message.reply("You didn't mention the user to ban!");
    }
}