const settings = require("../../config/general/settings.json");
const Discord = require("discord.js");

module.exports = {
    name: "addSong",
    async execute(client, distube, queue, song) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Song added")
            .setColor(settings.botMusicali.find(x => x.id == client.user.id).color)
            .setDescription(`:inbox_tray: ${song.name}`)

        song.metadata.editReply({ embeds: [embed] })
    }
}