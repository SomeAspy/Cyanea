import { readdirSync } from 'fs';
const commandFolders = readdirSync('./commands');
export let slashCommandData = [];
export let slashCommands = new Map();

export async function indexSlashCommands() {
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./commands/${folder}`).filter(file =>
            file.endsWith('.js') && file.startsWith('slash.'),
        );
        for (const file of commandFiles) {
            console.log(`[Slash Command Indexer]: Found command file: ${file}`.green);
            const slashCommand = await import(`../commands/${folder}/${file}`);
            slashCommandData.push(slashCommand.data);
            slashCommands.set(slashCommand.data.name, slashCommand);
        }
    }
}