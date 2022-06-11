const settings = require("../../../config/general/settings.json")
const ttsQueue = []
let countdown = -1;
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");

const ttsPlay = (connection) => {
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
            ttsPlay(connection)
        }
    });
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

module.exports = { ttsQueue, ttsPlay, ttsInactivity }