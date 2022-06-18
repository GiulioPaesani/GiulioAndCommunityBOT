const lastNowPlaying = new Map()

const updateNowPlayingMsg = (client, channel, newMsg) => {
    if (lastNowPlaying.has(client.user.id)) {
        channel.messages.fetch(lastNowPlaying.get(client.user.id)).then(msg => msg.delete())
        lastNowPlaying.delete(client.user.id)
    }

    if (newMsg)
        lastNowPlaying.set(client.user.id, newMsg.id)
}

module.exports = { updateNowPlayingMsg }