import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import { getTopLevel } from './lib/db.js';
import lightercolors from 'lighter-colors';
import { verbose } from './lib/flags.js';

dotenv.config();

const cli = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Ready Event

cli.once(Events.ClientReady, () => console.log(`[info]: Connected to Discord!\n\tGuild Count: ${cli.guilds.cache.size}\n\tMy ID: ${cli.user.id}`.green))

// Text Command Indexer ******************************************************

import { indexTextCommands } from './indexers/textIndexer.js';
await indexTextCommands();

// Slash Command Indexer *****************************************************

import { indexSlashCommands } from './indexers/slashIndexer.js';
await indexSlashCommands();

// Push Commands to Discord API **********************************************
import { pushCommands } from './lib/pushCommands.js';
await pushCommands();

// Message handler ***********************************************************

import { commands } from './indexers/textIndexer.js';
import { handleMessage } from './handlers/messageHandler.js';
cli.on(Events.MessageCreate, async message => {
    await handleMessage(message, cli, commands);
})

// Interaction Handler ********************************************************

import { handleInteraction } from './handlers/interactionHandler.js';
import { slashCommands } from './indexers/slashIndexer.js';
cli.on(Events.InteractionCreate, async interaction => {
    await handleInteraction(interaction, cli, slashCommands);
})

// Other Events ***************************************************************

cli.on(Events.Error, (e) => console.log(colors.red(e)));
cli.on(Events.Warn, (e) => console.log(colors.yellow(e)));
if (verbose) {
    cli.on(Events.Debug, (e) => console.log(colors.magenta(e)));
}
cli.on(Events.Invalidated, () => {
    console.log(
        'Session invalidated! Shutting down, Reboot will be required manually.'.bgRed,
    );
    cli.destroy();
    process.exit(3);
});

// Login *********************************************************************

await cli.login(process.env.DISCORD_TOKEN);
cli.user.setStatus(await getTopLevel("status"));