import { delServerKey, newServerKey } from "../../lib/db.js";
import { SlashCommandBuilder } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("reactionmanager")
    .setDescription("Manage reaction triggers for this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
        subcommand
            .setName("add")
            .setDescription("Add a new reaction")
            .addStringOption((option) => option.setName("trigger").setDescription("Text to trigger response").setRequired(true))
            .addStringOption((option) => option.setName("response").setDescription("Reaction to trigger").setRequired(true))
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
        await newServerKey(interaction.guildId, "reactTo", trigger, response);
        interaction.reply(`Added reaction "${interaction.options.getString("trigger")}" with reaction ${interaction.options.getString("response")}`);
    }
    else if (subcommand === "remove") {
        await delServerKey(interaction.guildId, "reactTo", interaction.options.getString("trigger"));
        interaction.reply(`Removed reaction "${trigger}"`);
    }
}