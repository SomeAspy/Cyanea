import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage a user's roles")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((subcommand) =>
        subcommand
            .setName("add")
            .setDescription("Add a role")
            .addUserOption((option) => option.setName("user").setDescription("The user to give the role to").setRequired(true))
            .addRoleOption((option) => option.setName("role").setDescription("The role to give the user").setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("remove")
            .setDescription("Remove a role")
            .addUserOption((option) => option.setName("user").setDescription("The user to remove the role from").setRequired(true))
            .addRoleOption((option) => option.setName("role").setDescription("The role to remove from the user").setRequired(true))
    )


export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getMember("user");
    const role = interaction.options.getRole("role");
    if (subcommand === "add") {
        try {
            await user.roles.add(role);
            interaction.reply({ content: `Added role "${role.name}" to user "${user.user.tag}"`, ephemeral: true });
        } catch (error) {
            console.log(error);
            interaction.reply({ content: `Failed to add role "${role.name}" to user "${user.user.tag}", The role is probably higher than my highest role.`, ephemeral: true });
        }

    }
    else if (subcommand === "remove") {
        try {
            await user.roles.remove(role);
            interaction.reply({ content: `Removed role "${role.name}" from user "${user.user.tag}"`, ephemeral: true });
        } catch (error) {
            console.log(error);
            interaction.reply({ content: `Failed to remove role "${role.name}" from user "${user.user.tag}", The role is probably higher than my highest role.`, ephemeral: true });
        }

    }
}