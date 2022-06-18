const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const illustrations = require("../../../config/general/illustrations.json")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "github",
    description: "Link alle repository pubbliche di Giulio",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/github",
    category: "info",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle(`${getEmoji(client, "GitHub")} GitHub ${getEmoji(client, "GitHub")}`)
            .setDescription(`Tutti i link github alle **repository pubbliche** di Giulio
Visualizza tutto il [profilo](https://github.com/GiulioPaesani) per maggiori info`)
            .addField(`${getEmoji(client, "GiulioAndCommunityBOT")} GiulioAndCommunity BOT`, `
[Clicca qui](https://github.com/GiulioPaesani/GiulioAndCommunityBOT) - Tutto il codice open-source del bot privato del server`)
            .addField(`${getEmoji(client, "GiulioAndTutorial")} GiulioAndTutorial`, `
[Clicca qui](https://github.com/GiulioPaesani/GiulioAndTutorial) - I codici e file di tutti i tutorial Discord.js trattati su YouTube`)
            .setThumbnail(illustrations.github)

        interaction.reply({ embeds: [embed] })
    },
};