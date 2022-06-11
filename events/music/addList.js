const settings = require("../../config/general/settings.json");
const Discord = require("discord.js");

module.exports = {
    name: "addList",
    async execute(client, distube, queue, playlist) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Songs added")
            .setColor(settings.botMusicali.find(x => x.id == client.user.id).color)
            .setDescription(`:inbox_tray: Tracks added from ${playlist.name}\n_Potrebbe volerci qualche secondo per aggiungere tutte le canzoni alla coda_`)

        queue.textChannel.msg.edit({ embeds: [embed] })
    }
}