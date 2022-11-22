import { getServerSetting } from "../../lib/db.js";
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("reactions")
    .setDescription("View reactions for this server")


export async function execute(interaction) {
    let tags = await getServerSetting(interaction.guildId, "reactTo");
    let tagString = "";
    let count = 0;
    for (const tag in tags) {
        tagString += `${count}. ${tag}: ${tags[tag]}\n`;
        ++count;
    }
    await interaction.reply(`\`\`\`${tagString}\`\`\``);
}