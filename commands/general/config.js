module.exports = {
    name: "config",
    aliases: ["notifiche", "notification", "notifications"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Personalizzare la ricezione di notifiche nel server",
    syntax: "!config",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == message.author.id)
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("Notification - " + (utente.nickname ? utente.nickname : utente.user.username))
            .setDescription("Impostare le notifiche da ricevere all'interno del server")
            .setThumbnail("https://i.postimg.cc/3wKvXm4M/Notifications.png")
            .addField(`📋 Announcements - ${utente.roles.cache.has(settings.ruoliNotification.announcements) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Annunci grossi e importanti relativi al canale e al server")
            .addField(`📰 News - ${utente.roles.cache.has(settings.ruoliNotification.news) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Notizie piccole e leggere sul canale e sul server")
            .addField(`📝 Changelog - ${utente.roles.cache.has(settings.ruoliNotification.changelog) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Tutte le novità, funzioni, comandi che vengono aggiunte al bot del server")
            .addField(`📱 YouTube GiulioAndCode - ${utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale GiulioAndCode")
            .addField(`✌ YouTube Giulio - ${utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale Giulio")

        var button1 = new Discord.MessageButton()
            .setEmoji("📋")
            .setCustomId(`notification,${message.author.id},1`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.announcements) ? "SUCCESS" : "DANGER")

        var button2 = new Discord.MessageButton()
            .setEmoji("📰")
            .setCustomId(`notification,${message.author.id},2`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.news) ? "SUCCESS" : "DANGER")

        var button3 = new Discord.MessageButton()
            .setEmoji("📝")
            .setCustomId(`notification,${message.author.id},3`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.changelog) ? "SUCCESS" : "DANGER")

        var button4 = new Discord.MessageButton()
            .setEmoji("📱")
            .setCustomId(`notification,${message.author.id},4`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? "SUCCESS" : "DANGER")

        var button5 = new Discord.MessageButton()
            .setEmoji("✌")
            .setCustomId(`notification,${message.author.id},5`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? "SUCCESS" : "DANGER")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)
            .addComponents(button5)

        message.channel.send({ embeds: [embed], components: [row] })
            .catch(() => { })
    },
};