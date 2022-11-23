import { readdirSync } from 'fs';
export let commands = new Map();
const commandFolders = readdirSync('./commands');

export async function indexTextCommands() {
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./commands/${folder}`).filter(file =>
            file.endsWith('.js') && file.startsWith('text.')
        );
        if (Object.keys(commandFiles).length < 1) {
            console.log(`[Text Command Indexer]: No text commands found in ${folder}!`.yellow);
            continue;
        }
        for (const file of commandFiles) {
            await import(`../commands/${folder}/${file}`).then(command => {
                commands.set(command.name, command);
                console.log(`[Text Command Indexer]: Found command file: ${file}`.green);
            })
        }
    }
}