const Discord = require("discord.js")
const { createCanvas } = require('canvas')
const settings = require("../../config/general/settings.json");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "banner",
    description: "Visuallizzare il banner di un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/banner (user)",
    category: "info",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere il banner",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        let embed = new Discord.MessageEmbed()
            .setTitle("Banner - " + (interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username))
            .setDescription("Il banner di questo utente")

        let user = await client.api.users(utente.id).get()

        if (user.banner) {
            embed.setImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}?size=512`)

            interaction.reply({ embeds: [embed] })
        }
        else if (user.banner_color || user.accent_color) {
            let canvas = await createCanvas(1024, 408)
            let ctx = await canvas.getContext('2d')

            ctx.fillStyle = user.banner_color || user.accent_color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            embed.setImage("attachment://canvas.png")

            interaction.reply({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
        }
        else {
            embed.setDescription("_Questo utente non ha impostato un banner_")
            interaction.reply({ embeds: [embed] })
        }
    },
};