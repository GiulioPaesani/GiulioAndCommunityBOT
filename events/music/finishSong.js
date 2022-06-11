const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg")

module.exports = {
    name: "finishSong",
    async execute(client, distube, queue, song) {
        updateNowPlayingMsg(client, queue.textChannel)
    }
}