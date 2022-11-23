import { isUserBlocked } from "../lib/db.js";
import colors from 'lighter-colors';
import { debug } from "../lib/flags.js";

export async function handleInteraction(interaction, cli, slashCommands) {
    if (await isUserBlocked(interaction.user.id, interaction.guild.id)) {
        if (debug) {
            console.log(`[Slash Handler]: User ${interaction.user.id} is blocked from using this bot!`.red);
        }
        interaction.reply({ content: "You are blocked from using this bot!", ephemeral: true });
        return;
    }

    // Button Handler
    if (interaction.isButton()) {
        if (debug) {
            console.log(`[Interaction Handler]: Button interaction received: ${interaction.customId}`.magenta);
        }

    }

    // Command Handler
    if (interaction.isCommand()) {
        try {
            slashCommands.get(interaction.commandName).execute(interaction, cli);
            if (debug) {
                console.log(`[Slash Command Handler]: Executed slash command ${interaction.commandName}`.green);
            }
        } catch (err) {
            console.log(colors.red(err));
        }
    }
}