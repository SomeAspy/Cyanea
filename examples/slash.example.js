import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("example")
    .setDescription("Example command")
    .addStringOption((option) => option.setName("input").setDescription("Input to echo back").setRequired(true));
export async function execute(interaction) {
    await interaction.reply(interaction.options.getString("input"));
}
