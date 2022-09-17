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
                },
                {
                    name: `🟣 Twitch Live - ${interaction.member.roles.cache.has(settings.ruoliNotification.live) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                    value: "Dirette Twitch su gaming, divertimento, programmazione ed eventi"
                },
                {
                    name: `🏆 Events - ${interaction.member.roles.cache.has(settings.ruoliNotification.events) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                    value: "Nuovi eventi su sfide di programmazione con la community"
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

        let button3 = new Discord.MessageButton()
            .setEmoji("🟣")
            .setCustomId(`notification,${interaction.user.id},3`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.live) ? "SUCCESS" : "DANGER")

        let button4 = new Discord.MessageButton()
            .setEmoji("🏆")
            .setCustomId(`notification,${interaction.user.id},4`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.events) ? "SUCCESS" : "DANGER")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};