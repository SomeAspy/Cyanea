import { EmbedBuilder } from 'discord.js';
import { getServerSettings } from '../../lib/db.js';
import { fillPlaceholders } from '../../lib/tools.js';
export const name = "mute"
export const description = "Mute a user."
export const usage = "mute <user> <time> [reason]"
export const permissions = "MUTE_MEMBERS"
export const botPerms = "MUTE_MEMBERS"
export const guildOnly = true
export async function execute(message, args, cli) {
    const user = message.mentions.members.first() || await cli.users.fetch(args[0]);
    args.shift();
    let time = args.shift();
    const reason = args.slice(1).join(' ') || 'No reason provided';
    if (!user) {
        return message.reply("Either you did not mention a user or the user does not exist.");
    }
    try {
        if (user.kickable) {
            let title, content, footer, text;
            await getServerSettings(message.guild.id).then((res) => {
                content = res["messages"]["mute"]["content"]
                title = res["messages"]["mute"]["title"]
                footer = res["messages"]["mute"]["footer"]
                text = res["messages"]["mute"]["text"]
            });
            time = time.split("");
            let unit = time.pop();
            time = time.join("");
            time = parseInt(time);
            time *= 1000;
            switch (unit) {
                case "s":
                    time = time;
                    break;
                case "h":
                    time *= 60 * 60;
                    break;
                case "d":
                    time *= 60 * 60 * 24;
                    break;
                case "w":
                    time *= 60 * 60 * 24 * 7;
                    break;
                case "m":
                default:
                    time *= 60;
            }
            await user.timeout(time, reason);
            if (!text) {
                const embed = new EmbedBuilder()
                    .setTitle(fillPlaceholders(title, message))
                    .setColor(0x00FF00)
                    .setDescription(fillPlaceholders(content, message, { reason: reason, time: time }))
                    .setTimestamp(new Date())
                    .setFooter({ text: fillPlaceholders(footer, message), iconURL: message.author.displayAvatarURL() });
                await message.channel.send({ embeds: [embed] });
            } else {
                await message.channel.send(fillPlaceholders(content, message, { reason: reason, time: time }));
            }
        } else {
            message.reply("I cannot mute this user, they may have a higher role than me.");
        }
    }
    catch (err) {
        console.log(err);
        message.reply(":warning: There was an error in the mute process, the user may or may not have been muted!");
    }

}