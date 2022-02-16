module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (isMaintenance(button.user.id)) return

        button.deferUpdate().catch(() => { })

        if (!button.customId.startsWith("notification")) return

        if (button.customId.split(",")[1] != button.user.id) return

        var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == button.user.id)
        if (!utente) return

        switch (button.customId.split(",")[2]) {
            case "1": {
                utente.roles.cache.has(settings.ruoliNotification.announcements) ? await utente.roles.remove(settings.ruoliNotification.announcements) : await utente.roles.add(settings.ruoliNotification.announcements)
            } break;
            case "2": {
                utente.roles.cache.has(settings.ruoliNotification.news) ? await utente.roles.remove(settings.ruoliNotification.news) : await utente.roles.add(settings.ruoliNotification.news)
            } break;
            case "3": {
                utente.roles.cache.has(settings.ruoliNotification.changelog) ? await utente.roles.remove(settings.ruoliNotification.changelog) : await utente.roles.add(settings.ruoliNotification.changelog)
            } break;
            case "4": {
                utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? await utente.roles.remove(settings.ruoliNotification.youtubeVideosCode) : await utente.roles.add(settings.ruoliNotification.youtubeVideosCode)
            } break;
            case "5": {
                utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? await utente.roles.remove(settings.ruoliNotification.youtubeVideosGiulio) : await utente.roles.add(settings.ruoliNotification.youtubeVideosGiulio)
            } break;
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(button.message.embeds[0].title)
            .setDescription(button.message.embeds[0].description)
            .setThumbnail("https://i.postimg.cc/3wKvXm4M/Notifications.png")
            .addField(`📋 Announcements - ${utente.roles.cache.has(settings.ruoliNotification.announcements) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Annunci grossi e importanti relativi al canale e al server")
            .addField(`📰 News - ${utente.roles.cache.has(settings.ruoliNotification.news) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Notizie piccole e leggere sul canale e sul server")
            .addField(`📝 Changelog - ${utente.roles.cache.has(settings.ruoliNotification.changelog) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Tutte le novità, funzioni, comandi che vengono aggiunte al bot del server")
            .addField(`📱 YouTube GiulioAndCode - ${utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale GiulioAndCode")
            .addField(`✌ YouTube Giulio - ${utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale Giulio")

        var button1 = new Discord.MessageButton()
            .setEmoji("📋")
            .setCustomId(`notification,${button.user.id},1${button.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.announcements) ? "SUCCESS" : "DANGER")

        var button2 = new Discord.MessageButton()
            .setEmoji("📰")
            .setCustomId(`notification,${button.user.id},2${button.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.news) ? "SUCCESS" : "DANGER")

        var button3 = new Discord.MessageButton()
            .setEmoji("📝")
            .setCustomId(`notification,${button.user.id},3${button.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.changelog) ? "SUCCESS" : "DANGER")

        var button4 = new Discord.MessageButton()
            .setEmoji("📱")
            .setCustomId(`notification,${button.user.id},4${button.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? "SUCCESS" : "DANGER")

        var button5 = new Discord.MessageButton()
            .setEmoji("✌")
            .setCustomId(`notification,${button.user.id},5${button.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? "SUCCESS" : "DANGER")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)
            .addComponents(button5)

        if (button.customId.split(",")[3]) {
            var button6 = new Discord.MessageButton()
                .setLabel("Torna indietro")
                .setStyle("SECONDARY")
                .setCustomId("setupIndietro,2")

            var button7 = new Discord.MessageButton()
                .setLabel("Salta/Prossimo step")
                .setStyle("PRIMARY")
                .setCustomId("setupAvanti,2")

            var row2 = new Discord.MessageActionRow()
                .addComponents(button6)
                .addComponents(button7)

            button.message.edit({ embeds: [embed], components: [row, row2] })
        }
        else {
            button.message.edit({ embeds: [embed], components: [row] })
        }
    },
};
