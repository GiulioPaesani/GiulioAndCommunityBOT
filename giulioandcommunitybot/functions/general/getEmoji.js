const getEmoji = (client, emojiName) => {
    return client.emojis.cache.find(x => x.name == emojiName)?.toString() || ""
}

module.exports = { getEmoji }