import { slashCommandData } from '../index.js';
import { getTopLevel } from './db.js';
import { clientID } from '../index.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
dotenv.config();

const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
export async function pushCommands() {
    try {
        console.log(
            `Attempting to push ${slashCommandData.length} commands to Discord API...`,
        );
        if (getTopLevel('devMode')) {
            console.log('Running in dev mode.\nPushing commands to guild...');
            await restAPI.put(
                Routes.applicationGuildCommands(clientID, getTopLevel('devGuild')),
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