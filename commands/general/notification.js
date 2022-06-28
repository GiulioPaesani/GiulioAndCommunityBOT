const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const illustrations = require("../../config/general/illustrations.json")

module.exports = {
    name: "notification",
    description: "Personalizzare le notifiche nel server",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 30,
    syntax: "/notification",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Notification - " + (interaction.member.nickname ? interaction.member.nickname : interaction.user.username))
            .setDescription("Impostare le notifiche da ricevere all'interno del server")
            .setThumbnail(illustrations.notification)
            .addField(`📋 Announcements - ${interaction.member.roles.cache.has(settings.ruoliNotification.announcements) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Annunci grossi e importanti relativi al canale e al server")
            .addField(`📰 News - ${interaction.member.roles.cache.has(settings.ruoliNotification.news) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Notizie piccole e leggere sul canale e sul server")
            .addField(`📝 Changelog - ${interaction.member.roles.cache.has(settings.ruoliNotification.changelog) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Tutte le novità, funzioni, comandi che vengono aggiunte al bot del server")
            .addField(`📱 YouTube GiulioAndCode - ${interaction.member.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale GiulioAndCode")
            .addField(`✌ YouTube Giulio - ${interaction.member.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale Giulio")

        let button1 = new Discord.MessageButton()
            .setEmoji("📋")
            .setCustomId(`notification,${interaction.user.id},1`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.announcements) ? "SUCCESS" : "DANGER")

        let button2 = new Discord.MessageButton()
            .setEmoji("📰")
            .setCustomId(`notification,${interaction.user.id},2`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.news) ? "SUCCESS" : "DANGER")

        let button3 = new Discord.MessageButton()
            .setEmoji("📝")
            .setCustomId(`notification,${interaction.user.id},3`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.changelog) ? "SUCCESS" : "DANGER")

        let button4 = new Discord.MessageButton()
            .setEmoji("📱")
            .setCustomId(`notification,${interaction.user.id},4`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? "SUCCESS" : "DANGER")

        let button5 = new Discord.MessageButton()
            .setEmoji("✌")
            .setCustomId(`notification,${interaction.user.id},5`)
            .setStyle(interaction.member.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? "SUCCESS" : "DANGER")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)
            .addComponents(button5)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};