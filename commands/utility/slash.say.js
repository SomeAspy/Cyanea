import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say something as the bot")
    .addStringOption((option) => option.setName("message").setDescription("Message to say").setRequired(true))


export async function execute(interaction) {
    await interaction.reply(interaction.options.getString("message"));
}