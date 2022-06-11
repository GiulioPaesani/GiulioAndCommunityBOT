const settings = require("../../config/general/settings.json");
const Discord = require("discord.js");

module.exports = {
    name: "finish",
    async execute(client, distube, queue) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Queue finished")
            .setColor(settings.botMusicali.find(x => x.id == client.user.id).color)
            .setDescription(`:o: La coda dei brani è terminata`)

        queue.textChannel.send({ embeds: [embed] })
    }
}