import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { getServer, readDB, getTopLevel, isUserBlocked } from './lib/db.js';
import { ObjectSearch } from './lib/tools.js';
import colors from 'colors';

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
for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file => {
        file.endsWith('.js') && file.startsWith('text.')
    });
    for (const file of commandFiles) {
        import(`./commands/${folder}/${file}`).then(command => {
            cli.commands.set(command.name, command);
            console.log(`[Command Indexer]: Found command file:  + file`.green);
        })
    }
}

// Slash Command Indexer

for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter((file) =>
        file.endsWith('.js'),
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
            console.log(`[Message Handler]: Message received: ${message.content}`.cyan);
        }
        if (isUserBlocked(message.author.id, message.guild.id)) {
            return;
        }

        if (message.author.id === cli.user.id) return;

        const server = await getServer(message.guild.id);
        if (!message.author.bot) {
            if (debug) {
                console.log(`[Message Handler]: Command processing started for message: ${message.content}`.magenta);
            }
            if (message.content.startsWith(server.prefix) || message.content.startsWith(`<@!${cli.user.id}>`)) {
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = cli.commands.get(commandName) || cli.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                console.log(`Attempting to execute command ${commandName} with args ${args}`.magenta);
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
    if (isUserBlocked(interaction.user.id, interaction.guild.id)) {
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
});

await cli.login(process.env.DISCORD_TOKEN);
cli.user.setStatus(getTopLevel("statusText"));