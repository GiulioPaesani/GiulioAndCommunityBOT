module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (isMaintenance(button.clicker.user.id)) return
        
        if (!button.id.startsWith("notification")) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == button.clicker.user.id)
        if (!utente) return

        switch (button.id.split(",")[2]) {
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

        var button1 = new disbut.MessageButton()
            .setEmoji("📋")
            .setID(`notification,${button.clicker.user.id},1${button.id.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.announcements) ? "green" : "red")

        var button2 = new disbut.MessageButton()
            .setEmoji("📰")
            .setID(`notification,${button.clicker.user.id},2${button.id.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.news) ? "green" : "red")

        var button3 = new disbut.MessageButton()
            .setEmoji("📝")
            .setID(`notification,${button.clicker.user.id},3${button.id.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.changelog) ? "green" : "red")

        var button4 = new disbut.MessageButton()
            .setEmoji("📱")
            .setID(`notification,${button.clicker.user.id},4${button.id.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? "green" : "red")

        var button5 = new disbut.MessageButton()
            .setEmoji("✌")
            .setID(`notification,${button.clicker.user.id},5${button.id.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? "green" : "red")

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)
            .addComponent(button3)
            .addComponent(button4)
            .addComponent(button5)

        if (button.id.split(",")[3]) {
            var button6 = new disbut.MessageButton()
                .setLabel("Torna indietro")
                .setStyle("gray")
                .setID("setupIndietro,2")

            var button7 = new disbut.MessageButton()
                .setLabel("Salta/Prossimo step")
                .setStyle("blurple")
                .setID("setupAvanti,2")

            var row2 = new disbut.MessageActionRow()
                .addComponent(button6)
                .addComponent(button7)

            button.message.edit({ embed: embed, components: [row, row2] })
        }
        else {
            button.message.edit(embed, row)
        }
    },
};
