# Slash Commands
All slash command file names must begin with `slash.` for them to be recognized by the slash command indexer.

Slash command format is consistent with Discord.JS v14.

See: https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files

All slash commands must have 2 exports, `data` and `execute`

`data` must be a `SlashCommandBuilder` object

`execute` must be an async function. The `interaction` and client (as `cli`) are passed to this function

```js
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("example")
    .setDescription("Example command")
    .addStringOption((option) => option.setName("input").setDescription("Input to echo back").setRequired(true));
export async function execute(interaction, cli) {
    await interaction.reply(interaction.options.getString("input"));
}
```