const Discord = require("discord.js");
const colors = require("../../../config/general/colors.json");

module.exports = {
    name: "error",
    async execute(client, distube, channel, error) {
        if (error.errorCode != "NOT_SUPPORTED_URL") return

        let embed = new Discord.MessageEmbed()
            .setTitle("Link non supportato")
            .setColor(colors.gray)
            .setDescription(`Il link che hai inserito non è supportato`)

        channel.msg.edit({ embeds: [embed] })
    }
}