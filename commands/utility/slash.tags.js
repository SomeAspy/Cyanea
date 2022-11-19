import { readDB } from "../../lib/db.js";
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("tags")
    .setDescription("View tags for this server")


export async function execute(interaction) {
    let tags = await readDB(interaction.guildId, "replyTo");
    let tagString = "";
    for (const tag in tags) {
        tagString += `${tag}: ${tags[tag]}\n`;
    }
    await interaction.reply(tagString);
}