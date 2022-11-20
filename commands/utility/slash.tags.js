import { getServerSetting } from "../../lib/db.js";
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("tags")
    .setDescription("View tags for this server")


export async function execute(interaction) {
    let tags = await getServerSetting(interaction.guildId, "replyTo");
    let tagString = "";
    let count = 0;
    for (const tag in tags) {
        tagString += `${count}. ${tag}: ${tags[tag]}\n`;
        ++count;
    }
    await interaction.reply(`\`\`\`${tagString}\`\`\``);
}