import { getServerSettings, isUserBlocked, getTopLevel } from "../lib/db.js";
import { ObjectSearch } from "../lib/tools.js";
import colors from 'lighter-colors';
import { debug } from "../lib/flags.js";

export async function handleMessage(message, cli, commands) {
    try {
        if (debug) {
            if (message.content.length < 1) return;
            console.log(`[Message Handler]: Message received: ${message.content}`);
        }
        if (await isUserBlocked(message.author.id, message.guild.id)) {
            console.log(`[Message Handler]: User ${message.author.id} is blocked from using this bot!`.red);
            return;
        }

        if (message.author.id === cli.user.id) return;
        const server = await getServerSettings(message.guild.id);
        if (!message.author.bot) {
            if (message.content.startsWith(server.prefix) || message.content.startsWith(`<@!${cli.user.id}>`)) {
                if (debug) {
                    console.log(`[Message Handler]: Command processing started for message: ${message.content}`.magenta);
                }
                const args = message.content.slice(server.prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                console.log(`Attempting to execute command ${commandName} with args ${args}`.magenta);

                // Check if command works in DMs
                if (command.guildOnly && message.channel.type === 'dm') {
                    return message.reply('I can\'t execute that command inside DMs!');
                }

                // Check if command requires args
                if (command.args && !args.length) {
                    let reply = `You didn't provide any arguments, ${message.author}!`;

                    if (command.usage) {
                        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
                    }
                    return message.channel.send({ content: reply });
                }

                // Check if author has permissions
                if (command.permissions) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !authorPerms.has(command.permissions)) {
                        return message.reply({ content: 'You can not do this!' });
                    }
                }

                // Check if bot has permissions
                for (i in command.botPermissions) {
                    if (!message.channel.permissionsFor(cli.user).has(command.botPermissions[i])) {
                        return message.reply({ content: `I need the \`${command.botPermissions[i]}\` permission to do this!` });
                    }
                }

                // Check if command is owner only
                if (command.ownerOnly && (await getTopLevel("ownerIDs")).includes(message.author.id)) {
                    return await message.reply({ content: 'Only the bot owners can do this!', ephemeral: true });
                }

                try {
                    await command.execute(message, args, cli);
                }
                catch (error) {
                    console.error(error);
                    return await message.reply({ content: 'there was an error trying to execute that command!' });
                }


            } else if (ObjectSearch(message.content, server.replyTo)) {
                try {
                    await message.channel.send(ObjectSearch(message.content, server.replyTo));
                } catch (error) {
                    console.error(error);
                }
            }
            if (ObjectSearch(message.content, server.reactTo)) {
                try {
                    await message.react(ObjectSearch(message.content, server.reactTo));
                } catch (error) {
                    console.error(error);
                    message.reply({ content: "I tried to react to that message with the emoji you specified, but I couldn't!" });
                }
            }


        }
    } catch (err) {
        console.log(colors.red(`[Message Handler]: ${err}`));
    }
}