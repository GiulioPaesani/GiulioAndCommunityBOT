const settings = require("../../config/general/settings.json");
const Discord = require("discord.js");

module.exports = {
    name: "noRelated",
    async execute(client, distube, queue) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Nessuna canzone correlata")
            .setColor(settings.botMusicali.find(x => x.id == client.user.id).color)
            .setDescription(`:paperclips: La modalità di riproduzione automatica è attivata, ma non ho trovato nessun brano correlato`)

        queue.textChannel.send({ embeds: [embed] })
    }
}