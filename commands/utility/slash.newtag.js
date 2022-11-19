import { getServer, newServerKey, readDB } from "../../lib/db.js";
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("newtag")
    .setDescription("create a new text trigger")
    .addStringOption((option) => option.setName("trigger").setDescription("Text to trigger response").setRequired(true))
    .addStringOption((option) => option.setName("response").setDescription("Response to trigger").setRequired(true));

export async function execute(interaction) {
    await newServerKey(interaction.guild.id, "replyTo", interaction.options.getString("trigger"), interaction.options.getString("response"));;
    await interaction.reply(`Added new tag: ${interaction.options.getString("trigger")}`);
}
