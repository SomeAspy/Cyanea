import { delServerKey, newServerKey, readDB } from "../../lib/db.js";
import { SlashCommandBuilder } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("tagmanager")
    .setDescription("Manage tags for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
        subcommand
            .setName("add")
            .setDescription("Add a new tag")
            .addStringOption((option) => option.setName("trigger").setDescription("Text to trigger response").setRequired(true))
            .addStringOption((option) => option.setName("response").setDescription("Response to trigger").setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("remove")
            .setDescription("Remove a tag")
            .addStringOption((option) => option.setName("trigger").setDescription("Text to trigger response").setRequired(true))
    )


export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const trigger = interaction.options.getString("trigger");
    const response = interaction.options.getString("response");
    if (subcommand === "add") {
        await newServerKey(interaction.guildId, "replyTo", trigger, response);
        interaction.reply(`Added tag "${interaction.options.getString("trigger")}" with response "${interaction.options.getString("response")}"`);
    }
    else if (subcommand === "remove") {
        await delServerKey(interaction.guildId, "replyTo", interaction.options.getString("trigger"));
        interaction.reply(`Removed tag "${trigger}"`);
    }
}