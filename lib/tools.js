export function ObjectSearch(string, searchObject) {
    for (const key in searchObject) {
        if (string.toLowerCase().includes(key.toLowerCase())) {
            return searchObject[key];
        }
    }
}

export function placeholders(message) {
    return {
        "user": message.author.username,
        "server": message.guild.name,
        "channel": message.channel.name,
        "prefix": message.client.prefix,
        "author": message.author.tag,
        "moderator": message.author.tag,
    }
}

export function fillPlaceholders(string, message, extra = {}) {
    const filler = placeholders(message);
    for (const key in filler) {
        string = string.replace(`{${key}}`, filler[key]);
    }
    if (Object.keys(extra).length > 0) {
        for (const key in extra) {
            string = string.replace(`{${key}}`, extra[key]);
        }
    }
    return string;
}