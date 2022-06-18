const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const illustrations = require("../../config/general/illustrations.json")

module.exports = {
    name: "illustrations",
    description: "Come ho realizzato il mio avatar e le mie illustrazioni",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/illustrations",
    category: "info",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":frame_photo: Le mie ILLUSTRAZIONI :frame_photo:")
            .setThumbnail(illustrations.illustrations)
            .setDescription(`Ecco come ho realizzato il mio **avatar** e le mie **illustrazioni**`)
            .addField(":globe_with_meridians: Sito", `
https://stubborn.fun/
Attraverso questo sito ho scaricato tutte le **risorse** e immagini necessarie, per poi comporle e mettere assieme in **Photoshop** e **Illustrator**`)
            .addField(":video_camera: Video", `
Guarda questo [video completo](https://youtu.be/mT-G-bRIREc) in cui mostro nel **dettaglio** come ho realizzato tutto ciò`)

        interaction.reply({ embeds: [embed] })
    },
};