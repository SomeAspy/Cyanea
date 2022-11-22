import { EmbedBuilder } from 'discord.js';
import { getServerSettings } from '../../lib/db.js';
import { fillPlaceholders } from '../../lib/tools.js';
export const name = "kick"
export const description = "Kicks a user from the server."
export const usage = "kick <user> [reason]"
export const permissions = "KICK_MEMBERS"
export const botPerms = "KICK_MEMBERS"
export const guildOnly = true
export async function execute(message, args, cli) {
    const user = message.mentions.members.first() || await cli.users.fetch(args[0]);
    const reason = args.slice(1).join(' ') || 'No reason provided';
    if (!user) {
        return message.reply("Either you did not mention a user or the user does not exist.");
    }
    try {
        if (user.kickable) {
            let title, content, footer;
            await getServerSettings(message.guild.id).then((res) => {
                content = res["messages"]["kick"]["content"]
                title = res["messages"]["kick"]["title"]
                footer = res["messages"]["kick"]["footer"]
            });
            await user.kick(reason);
            const embed = new EmbedBuilder()
                .setTitle(fillPlaceholders(title, message))
                .setColor(0x00FF00)
                .setDescription(fillPlaceholders(content, message, { reason: reason }))
                .setTimestamp(new Date())
                .setFooter({ text: fillPlaceholders(footer, message), iconURL: message.author.displayAvatarURL() });
            await message.channel.send({ embeds: [embed] });
        } else {
            message.reply("I cannot kick this user, they may have a higher role than me.");
        }
    } catch (err) {
        console.log(err);
        message.reply(":warning: There was an error in the kick process, the user may or may not have been kicked!");
    }

}