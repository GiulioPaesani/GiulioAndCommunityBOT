const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")

module.exports = {
    name: "youtube",
    description: "Link ai canali YouTube di Giulio",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/youtube",
    category: "info",
    client: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle("GiulioAndCode")
            .setColor("#41A9F6")
            .setDescription("Questi sono i **canali** di Giulio\nIscriviti, lascia like, e attiva la campanellina")
            .addField(":computer: GiulioAndCode", `
[View channel](https://www.youtube.com/c/GiulioAndCode)
Video, tutorial, contenuti sulla programmazione, nello specifico nel mondo di Bot Discord`)
            .addField(":v: Giulio", `
[View channel](https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA)
Contenuti più personali e incentrati sull'intrattenimento`)

        interaction.reply({ embeds: [embed] })
    },
};