const settings = require("../../config/general/settings.json")
let ttsQueue = []
let countdown = -1;
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { isMaintenance } = require("../../functions/general/isMaintenance");

const ttsPlay = (client, connection) => {
    if (ttsQueue.length == 0) return

    const url = ttsQueue[0]
    countdown = -1

    const audioPlayer = createAudioPlayer();

    const resource = createAudioResource(url)

    connection.subscribe(audioPlayer);

    audioPlayer.play(resource);

    audioPlayer.on(AudioPlayerStatus.Playing, () => {
    });

    audioPlayer.on(AudioPlayerStatus.Idle, (oldOne, newOne) => {
        if (newOne.status == "idle") {
            ttsQueue.shift()
            countdown = 20
            ttsPlay(client, connection)
        }
    });

    client.once("voiceStateUpdate", (oldState, newState) => {
        if (isMaintenance(newState.id)) return

        if (newState.guild.id != settings.idServer) return

        if (newState.id != client.user.id) return

        if (oldState.channelId && !newState.channelId) {
            audioPlayer.stop()
            ttsQueue = []
        }
    })
}

const ttsInactivity = (client) => {
    if (ttsQueue.length != 0) return

    if (countdown > 0) countdown--

    if (countdown == 0) {
        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(client.user.id)
        utente?.voice?.disconnect()
        countdown = -1
    }
}

const addQueue = (client, url, connection) => {
    ttsQueue.push(url)

    if (ttsQueue.length == 1)
        ttsPlay(client, connection)
}

module.exports = { ttsQueue, ttsPlay, ttsInactivity, addQueue }