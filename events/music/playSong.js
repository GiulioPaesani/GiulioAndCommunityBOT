const settings = require("../../config/general/settings.json");
const Discord = require("discord.js");
const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg.js");

module.exports = {
    name: "playSong",
    async execute(client, distube, queue, song) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Now playing...")
            .setColor(settings.botMusicali.find(x => x.id == client.user.id).color)
            .setDescription(`:arrow_forward: ${song.name}`)

        let msg = await queue.textChannel.send({ embeds: [embed] })

        updateNowPlayingMsg(client, queue.textChannel, msg)
    }
}