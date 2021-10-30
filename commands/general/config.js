module.exports = {
    name: "config",
    aliases: ["notifiche", "notification", "notifications"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Notification - " + message.member.user.tag)
            .setDescription("Impostare le notifiche da ricevere all'interno del server")
            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
            .addField(message.member.roles.cache.has(config.ruoliNotification.announcements) ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
            .addField(message.member.roles.cache.has(config.ruoliNotification.news) ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
            .addField(message.member.roles.cache.has(config.ruoliNotification.changelog) ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosCode) ? "📱 YouTube GiulioAndCode - :green_circle: ON" : "📱 YouTube GiulioAndCode - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")
            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosGiulio) ? "✌ YouTube Giulio - :green_circle: ON" : "✌ YouTube Giulio - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale Giulio")

        message.channel.send(embed)
            .then((msg) => {
                msg.delete({ timeout: 120000 })
                    .catch(() => { })
                msg.react("📋")
                msg.react("📰")
                msg.react("📝")
                msg.react("📱")
                msg.react("✌")
                message.delete({ timeout: 120000 })
                    .catch(() => { })

                // Filters
                const reactAnnouncements = (reaction, user) => reaction.emoji.name === '📋'
                const reactNews = (reaction, user) => reaction.emoji.name === '📰'
                const reactChangelog = (reaction, user) => reaction.emoji.name === '📝'
                const reactGiulioAndCode = (reaction, user) => reaction.emoji.name === '📱'
                const reactGiulio = (reaction, user) => reaction.emoji.name === '✌'

                const paginaAnnouncements = msg.createReactionCollector(reactAnnouncements)
                const paginaNews = msg.createReactionCollector(reactNews)
                const paginaGiulioAndCode = msg.createReactionCollector(reactGiulioAndCode)
                const paginaChangelog = msg.createReactionCollector(reactChangelog)
                const paginaGiulio = msg.createReactionCollector(reactGiulio)

                paginaAnnouncements.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())
                    if (u.id == message.author.id) {

                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")

                        if (!message.member.roles.cache.has(config.ruoliNotification.announcements)) {
                            message.member.roles.add(config.ruoliNotification.announcements)
                            embed
                                .addField("📋 Announcements - :green_circle: ON", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                        }
                        else {
                            message.member.roles.remove(config.ruoliNotification.announcements)
                            embed
                                .addField("📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                        }
                        embed
                            .addField(message.member.roles.cache.has(config.ruoliNotification.news) ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.changelog) ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosCode) ? "📱 YouTube GiulioAndCode - :green_circle: ON" : "📱 YouTube GiulioAndCode - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosGiulio) ? "✌ YouTube Giulio - :green_circle: ON" : "✌ YouTube Giulio - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale Giulio")
                        msg.edit(embed)
                    }
                })
                paginaNews.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                    if (u.id == message.author.id) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.announcements) ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")

                        if (!message.member.roles.cache.has(config.ruoliNotification.news)) {
                            message.member.roles.add(config.ruoliNotification.news)
                            embed
                                .addField("📰 News - :green_circle: ON", "Notifiche su annunci un po' meno importanti")
                        }
                        else {
                            message.member.roles.remove(config.ruoliNotification.news)
                            embed
                                .addField("📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                        }
                        embed
                            .addField(message.member.roles.cache.has(config.ruoliNotification.changelog) ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosCode) ? "📱 YouTube GiulioAndCode - :green_circle: ON" : "📱 YouTube GiulioAndCode - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosGiulio) ? "✌ YouTube Giulio - :green_circle: ON" : "✌ YouTube Giulio - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale Giulio")
                        msg.edit(embed)
                    }
                })
                paginaChangelog.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                    if (u.id == message.author.id) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.announcements) ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.news) ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                        if (!message.member.roles.cache.has(config.ruoliNotification.changelog)) {
                            message.member.roles.add(config.ruoliNotification.changelog)
                            embed
                                .addField("📝 Changelog - :green_circle: ON", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                        }
                        else {
                            message.member.roles.remove(config.ruoliNotification.changelog)
                            embed
                                .addField("📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                        }
                        embed
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosCode) ? "📱 YouTube GiulioAndCode - :green_circle: ON" : "📱 YouTube GiulioAndCode - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosGiulio) ? "✌ YouTube Giulio - :green_circle: ON" : "✌ YouTube Giulio - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale Giulio")
                        msg.edit(embed)
                    }
                })
                paginaGiulioAndCode.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                    if (u.id == message.author.id) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.announcements) ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.news) ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.changelog) ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")

                        if (!message.member.roles.cache.has(config.ruoliNotification.youtubeVideosCode)) {
                            message.member.roles.add(config.ruoliNotification.youtubeVideosCode)
                            embed
                                .addField("📱 YouTube GiulioAndCode - :green_circle: ON", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")
                        }
                        else {
                            message.member.roles.remove(config.ruoliNotification.youtubeVideosCode)
                            embed
                                .addField("📱 YouTube GiulioAndCode - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")
                        }
                        embed.addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosGiulio) ? "✌ YouTube Giulio - :green_circle: ON" : "✌ YouTube Giulio - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale Giulio")
                        msg.edit(embed)
                    }
                })
                paginaGiulio.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                    if (u.id == message.author.id) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.announcements) ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.news) ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.changelog) ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            .addField(message.member.roles.cache.has(config.ruoliNotification.youtubeVideosCode) ? "📱 YouTube GiulioAndCode - :green_circle: ON" : "📱 YouTube GiulioAndCode - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiulioAndCode")

                        if (!message.member.roles.cache.has(config.ruoliNotification.youtubeVideosGiulio)) {
                            message.member.roles.add(config.ruoliNotification.youtubeVideosGiulio)
                            embed
                                .addField("✌ YouTube Giulio - :green_circle: ON", "Notifiche sui nuovi video usciti sul canale Giulio")
                        }
                        else {
                            message.member.roles.remove(config.ruoliNotification.youtubeVideosGiulio)
                            embed
                                .addField("✌ YouTube Giulio - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale GiuliAndCode")
                        }
                        msg.edit(embed)
                    }
                })
            })
    },
};