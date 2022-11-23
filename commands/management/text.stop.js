export const name = "stop"
export const description = "Gracefully shut down the bot"
export const usage = "stop"
export const guildOnly = false
export const ownerOnly = true
export async function execute(message, args, cli = undefined) {
    console.log("[Stop Command]: Stopping bot...".red);
    await message.reply("**Shutting down!**");
    await cli.destroy();
    process.exit(0);
}