import { EmbedBuilder } from 'discord.js';
import { getServerSettings } from '../../lib/db.js';
import { fillPlaceholders } from '../../lib/tools.js';
export const name = "unmute"
export const description = "Unmute a user."
export const usage = "unmute <user> [reason]"
export const permissions = "MUTE_MEMBERS"
export const botPerms = "MUTE_MEMBERS"
export const guildOnly = true
export async function execute(message, args, cli) {
    const user = message.mentions.members.first() || await cli.users.fetch(args[0]);
    const reason = args.slice(1).join(' ') || 'No reason provided';
    if (!user) {
        return message.reply("Either you did not mention a user or the user does not exist.");
    }
    try {
        if (user.kickable) {
            let title, content, footer, text;
            await getServerSettings(message.guild.id).then((res) => {
                content = res["messages"]["unmute"]["content"]
                title = res["messages"]["unmute"]["title"]
                footer = res["messages"]["unmute"]["footer"]
                text = res["messages"]["unmute"]["text"]
            });
            await user.timeout(null, reason);
            if (!text) {
                const embed = new EmbedBuilder()
                    .setTitle(fillPlaceholders(title, message))
                    .setColor(0x00FF00)
                    .setDescription(fillPlaceholders(content, message, { reason: reason }))
                    .setTimestamp(new Date())
                    .setFooter({ text: fillPlaceholders(footer, message), iconURL: message.author.displayAvatarURL() });
                await message.channel.send({ embeds: [embed] });
            } else {
                await message.channel.send(fillPlaceholders(content, message, { reason: reason, time: time }));
            }
        } else {
            message.reply("I cannot unmute this user, they may have a higher role than me.");
        }
    }
    catch (err) {
        console.log(err);
        message.reply(":warning: There was an error in the unmute process, the user may or may not have been unmuted!");
    }

}