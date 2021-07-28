const Discord = require("discord.js");

module.exports = {
    name: "config",
    aliases: ["notifiche", "notification", "notifications"],
    onlyStaff: false,
    channelsGranted: ["869975190052929566"],
    execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Notification - " + message.member.user.tag)
            .setDescription("Impostare le notifiche da ricevere all'interno del server")
            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
            .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
            .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
            .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
            .addField(message.member.roles.cache.has("857544584691318814") ? "📽️ YouTube - :green_circle: ON" : "📽️ YouTube - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale YouTube")

        message.channel.send(embed)
            .then((msg) => {
                msg.delete({ timeout: 120000 })
                msg.react("📋")
                msg.react("📰")
                msg.react("📝")
                msg.react("📽️")
                message.delete({ timeout: 120000 })

                // Filters
                const reactAnnouncements = (reaction, user) => reaction.emoji.name === '📋'
                const reactNews = (reaction, user) => reaction.emoji.name === '📰'
                const reactYoutube = (reaction, user) => reaction.emoji.name === '📽️'
                const reactChangelog = (reaction, user) => reaction.emoji.name === '📝'

                const paginaAnnouncements = msg.createReactionCollector(reactAnnouncements)
                const paginaNews = msg.createReactionCollector(reactNews)
                const paginaYoutube = msg.createReactionCollector(reactYoutube)
                const paginaChangelog = msg.createReactionCollector(reactChangelog)

                paginaAnnouncements.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())
                    if (u.id == message.author.id) {

                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")

                        if (!message.member.roles.cache.has("815649916574629941")) {
                            message.member.roles.add("815649916574629941")
                            embed
                                .addField("📋 Announcements - :green_circle: ON", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                        }
                        else {
                            message.member.roles.remove("815649916574629941")
                            embed
                                .addField("📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                        }
                        embed
                            .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            .addField(message.member.roles.cache.has("857544584691318814") ? "📽️ YouTube - :green_circle: ON" : "📽️ YouTube - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale YouTube")
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
                            .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale YouTube")

                        if (!message.member.roles.cache.has("815649625591382077")) {
                            message.member.roles.add("815649625591382077")
                            embed
                                .addField("📰 News - :green_circle: ON", "Notifiche su annunci un po' meno importanti")
                        }
                        else {
                            message.member.roles.remove("815649625591382077")
                            embed
                                .addField("📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                        }
                        embed
                            .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            .addField(message.member.roles.cache.has("857544584691318814") ? "📽️ YouTube - :green_circle: ON" : "📽️ YouTube - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale YouTube")
                        msg.edit(embed)
                    }
                })
                paginaYoutube.on('collect', (r, u) => {
                    if (u.bot)
                        return
                    r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                    if (u.id == message.author.id) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Notification - " + message.member.user.tag)
                            .setDescription("Impostare le notifiche da ricevere all'interno del server")
                            .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                            .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")

                        if (!message.member.roles.cache.has("857544584691318814")) {
                            message.member.roles.add("857544584691318814")
                            embed
                                .addField("📽️ YouTube - :green_circle: ON", "Notifiche sui nuovi video usciti sul canale YouTube")
                        }
                        else {
                            message.member.roles.remove("857544584691318814")
                            embed
                                .addField("📽️ YouTube - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale YouTube")
                        }
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
                            .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                        if (!message.member.roles.cache.has("826784690487951370")) {
                            message.member.roles.add("826784690487951370")
                            embed
                                .addField("📝 Changelog - :green_circle: ON", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                        }
                        else {
                            message.member.roles.remove("826784690487951370")
                            embed
                                .addField("📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                        }
                        embed
                            .addField(message.member.roles.cache.has("857544584691318814") ? "📽️ YouTube - :green_circle: ON" : "📽️ YouTube - :red_circle: OFF", "Notifiche sui nuovi video usciti sul canale YouTube")
                        msg.edit(embed)
                    }
                })
            })
    },
};