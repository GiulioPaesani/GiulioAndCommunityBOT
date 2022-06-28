const fetchAllMessages = async (channel) => {
    let allMessages = [];
    let lastMessage;

    while (true) {
        let options = { limit: 100 };
        if (lastMessage) {
            options.before = lastMessage;
        }

        let messages = await channel.messages.fetch(options)

        allMessages = allMessages.concat(Array.from(messages.values()))

        lastMessage = messages.last()?.id;

        if (messages.size != 100) {
            break
        }
    }

    return allMessages.reverse();
}

module.exports = { fetchAllMessages }