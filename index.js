import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { getServerSettings, readDB, getTopLevel, isUserBlocked } from './lib/db.js';
import { ObjectSearch } from './lib/tools.js';
import colors from 'colors';

if (!await getTopLevel("readable")) {
    console.log("The database may be corrupted or missing! This will require manual intervention!".red);
    process.exit(2);
}

if (await getTopLevel("example")) {
    console.log("Please edit the config.json file!".red);
    process.exit(1);
}


const args = process.argv.slice(2);

export let debug;
if (args.find(arg => arg === "--debug")) {
    console.log("[Info]: Running in debug mode!".blue);
    debug = true;
} else {
    debug = false;
}

export let devMode;
if (args.find(arg => arg === "--dev")) {
    console.log("[Info]: Running in development mode!".blue);
    devMode = true;
} else {
    devMode = false;
}

dotenv.config();

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]

const cli = new Client({
    intents: intents,
});

cli.once('ready', () => console.log(`[info]: Connected to Discord!\n\tGuild Count: ${cli.guilds.cache.size}\n\tMy ID: ${cli.user.id}`.green))

export let slashCommandData = [];
let slashCommands = new Map();

export const clientID = getTopLevel("botID") // this must happen before the commands are pushed

const commandFolders = readdirSync('./commands');

// Text Command Indexer
export let commands = new Map();
for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file =>
        file.endsWith('.js') && file.startsWith('text.')
    );
    if (Object.keys(commandFiles).length < 1) {
        console.log(`[Text Command Indexer]: No text commands found in ${folder}!`.yellow);
        continue;
    }
    for (const file of commandFiles) {
        await import(`./commands/${folder}/${file}`).then(command => {
            commands.set(command.name, command);
            console.log(`[Text Command Indexer]: Found command file:  + file`.green);
        })
    }
}

// Slash Command Indexer

for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file =>
        file.endsWith('.js') && file.startsWith('slash.'),
    );
    for (const file of commandFiles) {
        console.log(`[Slash Indexer]: Found command file: ${file}`.green);
        const slashCommand = await import(`./commands/${folder}/${file}`);
        slashCommandData.push(slashCommand.data);
        slashCommands.set(slashCommand.data.name, slashCommand);
    }
}

import { pushCommands } from './lib/pushCommands.js';
await pushCommands();


// Message handler
cli.on('messageCreate', async message => {
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

                    return message.channel.send(reply);
                }

                // Check if author has permissions
                if (command.permissions) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !authorPerms.has(command.permissions)) {
                        return message.reply('You can not do this!');
                    }
                }

                // Check if bot has permissions
                for (i in command.botPermissions) {
                    if (!message.channel.permissionsFor(cli.user).has(command.botPermissions[i])) {
                        return message.reply(`I need the \`${command.botPermissions[i]}\` permission to do this!`);
                    }
                }

                try {
                    await command.execute(message, args);
                }
                catch (error) {
                    console.error(error);
                    message.reply('there was an error trying to execute that command!');
                }


            } else if (ObjectSearch(message.content, server.replyTo)) {
                message.channel.send(ObjectSearch(message.content, server.replyTo));
            }
            if (ObjectSearch(message.content, server.reactTo)) {
                message.react(ObjectSearch(message.content, server.reactTo));
            }


        }
    } catch (err) {
        console.log(colors.red(err));
    }
})

// Slash command handler
cli.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (await isUserBlocked(interaction.user.id, interaction.guild.id)) {
        if (debug) {
            console.log(`[Slash Handler]: User ${interaction.user.id} is blocked from using this bot!`.red);
        }
        interaction.reply({ content: "You are blocked from using this bot!", ephemeral: true });
        return;
    }
    try {
        slashCommands.get(interaction.commandName).execute(interaction, cli);
        if (debug) {
            console.log(`[Slash Command Handler]: Executed slash command ${interaction.commandName}`.green);
        }
    } catch (err) {
        console.log(colors.red(err));
    }
})



cli.on(['error', 'invalidRequestWarning', 'rateLimit', 'warn'], (e) => console.log(colors.red(e)));
cli.on('invalidated', () => {
    console.log(
        'Session invalidated! Shutting down, Reboot will be required manually.'.bgRed,
    );
    cli.destroy();
    process.exit(3);
});

await cli.login(process.env.DISCORD_TOKEN);
cli.user.setStatus('dnd'); // this doesn't work for whatever reason