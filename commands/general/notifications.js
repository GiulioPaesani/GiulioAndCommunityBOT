const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const illustrations = require("../../config/general/illustrations.json")

module.exports = {
    name: "notifications",
    description: "Personalizzare le notifiche ping nel server",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 30,
    syntax: "/notifications",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Notifications - " + (interaction.member.nickname ? interaction.member.nickname : interaction.user.username))
            .setDescription("Impostare le notifiche ping da ricevere all'interno del server")
            .setThumbnail(illustrations.notification)
            .addFields([
                {
                    name: `📢 Announcements - ${interaction.member.roles.cache.has(settings.ruoliNotification.announcements) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                    value: "Annunci, notizie e novità nel server, nel canale o molto altro"
                },
                {
                    name: `📹 YouTube Video - ${interaction.member.roles.cache.has(settings.ruoliNotification.video) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                    value: "Nuovi video pubblicati sul canale YouTube di GiulioAndCode"
                }
            ])

        let button1 = new Discord.MessageButton()
            .setEmoji("📢")
            .setCustomId(`notification,${interaction.user.id},1`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.announcements) ? "SUCCESS" : "DANGER")

        let button2 = new Discord.MessageButton()
            .setEmoji("📹")
            .setCustomId(`notification,${interaction.user.id},2`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.video) ? "SUCCESS" : "DANGER")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};