const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "tiktok",
    description: "Link al profilo TikTok di Giulio",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/tiktok",
    category: "info",
    client: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle(`${getEmoji(client, "TikTok")} TikTok ${getEmoji(client, "TikTok")}`)
            .setColor("#F00044")
            .setDescription("Ecco il profilo TikTok di **Giulio**\n:link: [giulio.paesani](https://www.tiktok.com/@giulio.paesani)")

        interaction.reply({ embeds: [embed] })
    },
};