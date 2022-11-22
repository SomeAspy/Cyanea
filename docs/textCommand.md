# Text Commands
All text command file names must begin with `text.` for them to be recognized by the text command indexer.

Text commands must contain the following information:

```js
export const name = "The name/trigger of the text command"
export const description = "What the command does"
export const usage = "How to use the command"
export const permissions = "Permissions the user needs to run the command (optional)"
export const botPerms = "Permissions the bot needs to run the command (optional)"
export const guildOnly = true // Whether or not the command is allowed in DMs (options, default: false)
export async function execute(message, args, cli) {
    //The actual command itself. you are provided the message, arguments (text after the main trigger), and optionally client.

}
```