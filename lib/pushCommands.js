import { getTopLevel } from './db.js';
import { slashCommandData } from '../index.js';
import { devMode } from './flags.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import colors from 'colors'
import dotenv from 'dotenv';
dotenv.config();


const guildID = await getTopLevel("devGuild");
const clientID = await getTopLevel("botID");



const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
export async function pushCommands() {
    try {
        console.log(
            `Attempting to push ${slashCommandData.length} commands to Discord API...`.magenta,
        );
        if (devMode) {
            console.log('Pushing commands to guild...'.magenta);
            await restAPI.put(
                Routes.applicationGuildCommands(clientID, guildID),
                { body: slashCommandData },
            );
        } else {
            console.log(
                'Running in production mode.\nPushing commands to bot globally...'.magenta,
            );
            await restAPI.put(Routes.applicationCommands(clientID), {
                body: slashCommandData,
            });
        }
        console.log(
            `Successfully pushed ${slashCommandData.length} commands to Discord API!`.green,
        );
    } catch (e) {
        console.log(colors.red(e));
    }
}
