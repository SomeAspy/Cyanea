import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';

const args = process.argv.slice(2);
console.log(args);

dotenv.config();

const cli = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

cli.on('ready', () => {
    console.log('Ready!');
});

const commandFolders = readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        import(`./commands/${folder}/${file}`).then(command => {
            cli.commands.set(command.name, command);
            console.log(`Found command ${command.name}`);
        });
    }
}


cli.on(['error', 'invalidRequestWarning', 'rateLimit', 'warn'], (e) => console.log(e));
cli.on('invalidated', () => {
    console.log(
        'Session invalidated! Shutting down, Reboot will be required manually.',
    );
    cli.destroy();
});

await cli.login(process.env.DISCORD_TOKEN);