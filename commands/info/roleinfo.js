const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const { createCanvas, loadImage } = require('canvas')

module.exports = {
    name: "roleinfo",
    description: "Visualizzare informazioni di un ruolo",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/roleinfo [role]",
    category: "info",
    data: {
        options: [
            {
                name: "role",
                description: "Ruolo di cui vedere le informazioni",
                type: "ROLE",
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let ruolo = interaction.options.getRole("role")

        let embed = new Discord.MessageEmbed()
            .setTitle(`@${ruolo.name}`)
            .setDescription("Tutte le informazioni di questo ruolo")
            .addField(":receipt: Role ID", ruolo.id, true)
            .addField(":busts_in_silhouette: Members", interaction.guild.members.cache.filter(x => x.roles.cache.has(ruolo.id)).size.toString(), true)
            .addField(":rainbow: Color", ruolo.hexColor.toUpperCase(), true)
            .addField(":1234: Position", ruolo.rawPosition.toString(), true)
            .addField(":speech_balloon: Mentionable", ruolo.mentionable ? "Yes" : "No", true)
            .addField(":safety_pin: Separated", ruolo.hoist ? "Yes" : "No", true)
            .addField(":pencil: Role created", `${moment(ruolo.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(ruolo.createdAt).fromNow()})`, true)

        if (ruolo.hexColor != "#000000")
            embed.setColor(ruolo.hexColor)

        if (ruolo.iconURL()) {
            let canvas = await createCanvas(400, 400)
            let ctx = await canvas.getContext('2d')

            let img = await loadImage(ruolo.iconURL({ size: 1024, format: "png" }))
            ctx.drawImage(img, canvas.width / 2 - 300 / 2, canvas.height / 2 - 300 / 2, 300, 300)

            embed.setThumbnail("attachment://canvas.png")

            interaction.reply({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
        }
        else
            interaction.reply({ embeds: [embed] })
    },
};