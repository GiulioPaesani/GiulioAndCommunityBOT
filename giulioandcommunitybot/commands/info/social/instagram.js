const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "instagram",
    description: "Link al profilo Instagram di Giulio",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/instagram",
    category: "info",
    client: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle(`${getEmoji(client, "Instagram")} Instagram ${getEmoji(client, "Instagram")}`)
            .setColor("#E7476B")
            .setDescription("Ecco il profilo Instagram di **Giulio**\n:link: [giulio_paesani](https://www.instagram.com/giulio_paesani/)")

        interaction.reply({ embeds: [embed] })
    },
};