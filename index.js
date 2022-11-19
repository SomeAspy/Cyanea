import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { getServer, readDB, getTopLevel, isUserBlocked } from './lib/db.js';
import { ObjectSearch } from './lib/tools.js';

const args = process.argv.slice(2);

dotenv.config();

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]

const cli = new Client({
    intents: intents,
});

cli.once('ready', () => console.log(`Connected to Discord!\nGuild Count: ${cli.guilds.cache.size}\nMy ID: ${cli.user.id}`))

export let slashCommandData = [];
let slashCommands = new Map();

export const clientID = getTopLevel("botID") // this must happen before the commands are pushed

const commandFolders = readdirSync('./commands');

// Text Command Indexer
for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file => {
        file.endsWith('.js') && !file.startsWith('slash.')
    });
    for (const file of commandFiles) {
        import(`./commands/${folder}/${file}`).then(command => {
            cli.commands.set(command.name, command);
            console.log('[Command Indexer]: Found command file: ' + file);
        })
    }
}

// Slash Command Indexer

for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter((file) =>
        file.endsWith('.js'),
    );
    for (const file of commandFiles) {
        console.log(`[Slash Indexer]: Found command file: ${file}`);
        const slashCommand = await import(`./commands/${folder}/${file}`);
        slashCommandData.push(slashCommand.data);
        slashCommands.set(slashCommand.data.name, slashCommand);
    }
}

import { pushCommands } from './lib/pushCommands.js';
await pushCommands();


// Text command handler
cli.on('messageCreate', async message => {
    try {
        if (isUserBlocked(message.author.id, message.guild.id)) {
            return;
        }
        if (message.author.id === cli.user.id) return;
        console.log("Saw Message!");
        const server = await getServer(message.guild.id);
        if (!message.author.bot) {
            if (message.content.startsWith(server.prefix) || message.content.startsWith(`<@!${cli.user.id}>`)) {
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = cli.commands.get(commandName) || cli.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                console.log(`Attempting to execute command ${commandName} with args ${args}`);
            } else if (ObjectSearch(message.content, server.replyTo)) {
                message.channel.send(ObjectSearch(message.content, server.replyTo));
            }
            if (ObjectSearch(message.content, server.reactTo)) {
                message.react(ObjectSearch(message.content, server.reactTo));
            }
        }
    } catch (err) {
        console.log(err);
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
        console.log(`Executed slash command ${interaction.commandName}`);
    } catch (err) {
        console.log(err);
    }
})



cli.on(['error', 'invalidRequestWarning', 'rateLimit', 'warn'], (e) => console.log(e));
cli.on('invalidated', () => {
    console.log(
        'Session invalidated! Shutting down, Reboot will be required manually.',
    );
    cli.destroy();
});

await cli.login(process.env.DISCORD_TOKEN);
cli.user.setStatus(getTopLevel("statusText"));