import { getTopLevel } from './db.js';
import { slashCommandData } from '../index.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
dotenv.config();

const devMode = await getTopLevel("devMode");
const guildID = await getTopLevel("devGuild");
const clientID = await getTopLevel("botID");



const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
export async function pushCommands() {
    try {
        console.log(
            `Attempting to push ${slashCommandData.length} commands to Discord API...`,
        );
        if (devMode) {
            console.log('Running in dev mode.\nPushing commands to guild...');
            await restAPI.put(
                Routes.applicationGuildCommands(clientID, guildID),
                { body: slashCommandData },
            );
        } else {
            console.log(
                'Running in production mode.\nPushing commands to bot globally...',
            );
            await restAPI.put(Routes.applicationCommands(clientID), {
                body: slashCommandData,
            });
        }
        console.log(
            `Successfully pushed ${slashCommandData.length} commands to Discord API!`,
        );
    } catch (e) {
        console.log(e);
    }
}
