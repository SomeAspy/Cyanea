export function ObjectSearch(string, searchObject) {
    for (const key in searchObject) {
        if (string.toLowerCase().includes(key.toLowerCase())) {
            return searchObject[key];
        }
    }
}

export function ResolveEmoji(emote, message) {
    return message.guild.emojis.cache.find(emoji => emoji.name === emote)
}