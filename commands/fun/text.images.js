import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
export const name = "images"
export const description = "Find images on the internet."
export const usage = "images <search>"
export const guildOnly = false
export async function execute(message, args, cli) {
    if (process.env.GOOGLE_CSE_ID && process.env.GOOGLE_API_KEY) {

        const search = args.join(' ');

        if (!search) {
            return message.channel.send('Please provide a search term.');
        }
        await fetch(`https://customsearch.googleapis.com/customsearch/v1?gl=us&hl=en&q=${search}&searchType=image&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}`).then(res => res.json()).then(json => {
            if (!json.items) {
                return message.channel.send('No results found.');
            }
            console.log(json.items[0].link)
            const menu = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('imagesPrev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('imagesNext')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                );

            const embed = new EmbedBuilder()
                .setTitle(`Search results for ${search}`)
                .setColor("0x00AE86")
                .setImage(json.items[0].link)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            message.channel.send({ embeds: [embed], components: [menu] });
        });

    } else {
        message.reply("Google API key and/or CSE ID not set.");
    }
}