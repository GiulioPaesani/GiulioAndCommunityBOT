module.exports = {
    name: `message`,
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3") return

        if (message.author.bot) return

        message.delete()

        var numeroBoost;
        if (message.content == "")
            numeroBoost = 1;
        else
            numeroBoost = parseInt(message.content)

        var livelloVecchio;
        var testoMancano;
        var nuovoLivello;
        if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" || 2 - message.guild.premiumSubscriptionCount <= 0) {
            nuovoLivello = `:crystal_ball: **LIVELLO 1 sbloccato**
+50 emoji
+15 sticker
Qualità audio 128 Kpms
Icona server animata
Sfondo inviti
Streaming fino a 720p`
        }
        else if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" || 7 - message.guild.premiumSubscriptionCount <= 0) {
            nuovoLivello = `:crystal_ball: **LIVELLO 2 sbloccato**
+50 emoji
+15 sticker
Qualità audio 256 Kpms
Banner del server
50 MB limite di caricamenti in chat
Streaming fino a 1080p 60fps
Icone ruoli personalizzate
`
        }
        else if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3" || 14 - message.guild.premiumSubscriptionCount <= 0) {
            nuovoLivello = `:crystal_ball: **LIVELLO 3 sbloccato**
+100 emoji
+30 sticker
Qualità audio 384 Kpms
Vanity URL
100 MB limite di caricamenti in chat`
        }

        if (message.guild.premiumSubscriptionCount - numeroBoost < 2) {
            livelloVecchio = 0
            if (2 - message.guild.premiumSubscriptionCount == 1)
                testoMancano = `_Manca solo **1 potenziamento** per il **Livello 1**_`
            else
                testoMancano = `_Mancano solo **${2 - message.guild.premiumSubscriptionCount} potenziamenti** per il **Livello 1**_`
        }
        else if (message.guild.premiumSubscriptionCount - numeroBoost < 7) {
            livelloVecchio = 1
            if (7 - message.guild.premiumSubscriptionCount == 1)
                testoMancano = `_Manca solo **1 potenziamento** per il **Livello 2**_`
            else
                testoMancano = `_Mancano solo **${7 - message.guild.premiumSubscriptionCount} potenziamenti** per il **Livello 2**_`
        }
        else {
            livelloVecchio = 3
            if (14 - message.guild.premiumSubscriptionCount == 1)
                testoMancano = `_Manca solo **1 potenziamento** per il **Livello 3**_`
            else if (14 - message.guild.premiumSubscriptionCount > 0)
                testoMancano = `_Mancano solo **${14 - message.guild.premiumSubscriptionCount} potenziamenti** per il **Livello 3**_`
            else
                testoMancano = ""
        }


        var embed = new Discord.MessageEmbed()
            .setTitle(":tada: Serverboost :tada:")
            .setColor("#FF73FA")
            .setDescription(`Grazie tantissime a <@${message.author.id}> per aver boostato il server!`)
            .addField(`Ha potenziato il server con ${numeroBoost} boost`, `\`Lvl. ${message.guild.premiumTier} Boost ${message.guild.premiumSubscriptionCount}\`

${nuovoLivello ? nuovoLivello : testoMancano}
`)

        var canale = client.channels.cache.get(settings.idCanaliServer.announcements);
        canale.send(embed);


        var embed = new Discord.MessageEmbed()
            .setTitle("Serverboost")
            .setColor("#22c90c")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField("Count", `${numeroBoost} boost`)
            .addField("Server level", `
Old: Lvl. ${livelloVecchio} Boost ${message.guild.premiumSubscriptionCount - numeroBoost}
New: Lvl. ${message.guild.premiumTier} Boost ${message.guild.premiumSubscriptionCount}`)

        if (!isMaintenance())
            client.channels.cache.get(log.server.serverBoostes).send(embed)

        const privilegiLevel = {
            "5": [
                `Streaming nelle chat vocali`,
                `Aggiungere **reazioni** ai messaggi`,
                `Allegare **file** nelle chat`,
                `Creare **stanze private testuali** in <#${settings.idCanaliServer.privateRooms}>`,
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "Giulio")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioBacio")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioOK")}`
            ],
            "10": [
                `Mandare **emoji** esterne`,
                `Creare **stanze private vocali**`,
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioAngry")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioGG")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioHappy")}`
            ],
            "15": [
                `Scrivere in chat <#${settings.idCanaliServer.noMicChat}> per utilizzare **KDBot**`,
                `Creare **stanze private vocali**`,
            ],
            "20": [
                `Creare **stanze private testuali+vocali**`,
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioPiangere")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioBuonanotte")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioSus")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioLove")}`
            ],
            "25": [
                `10% di **boost** di esperienza nel livellamento`,
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioBan")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioCool")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioCringe")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioF")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioRip")}`
            ],
            "30": [
                `Scrivere nella chat <#${settings.idCanaliServer.selfAdv}>`,
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioLOL")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioHi")}`
            ],
            "35": [
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioWow")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioCattivo")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioLive")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioSad")}`
            ],
            "40": [
                `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioPopCorn")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioPaura")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioDomandoso")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioFesta")}`
            ],
            "50": [
                `20% di **boost** di esperienza nel livellamento`,
            ],
            "100": [
                `**Priorità di parola** nella chat vocali`,
            ],
        }

        var textPrivilegi = `- Ruolo @Server Booster\r`

        for (var index in privilegiLevel) {
            if (parseInt(index) <= 30) {
                privilegiLevel[index].forEach(privilegio => {
                    if (!privilegio.startsWith("Nuove **emoji**"))
                        textPrivilegi += `- ${privilegio}\r`
                })
            }
        }

        textPrivilegi += `- Tutte le **emoji** del server: ${client.emojis.cache.find(emoji => emoji.name === "GiulioHappy")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioAngry")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioSus")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioCringe")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioF")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioFesta")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioCattivo")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioPopCorn")} e molte altre...\r`

        var items = require("../../config/items.json")
        var textItems = ""
        items.forEach(item => {
            if (item.priviled && item.priviled <= 30) {
                textItems += `${item.icon} `
            }
        })
        if (textItems != "")
            textPrivilegi += `- Nuovi oggetti nello **shop**: ${textItems}\r`

        var embed = new Discord.MessageEmbed()
            .setTitle(":tada: Grazie per il boost!")
            .setColor("#FF73FA")
            .setThumbnail("https://i.postimg.cc/bwYTBwzX/Serverboost.png")
            .setDescription("Grazie mille per aver boostato il server\rPer tutto il periodo di boost avrai accesso a tutti i **privilegi** che trovi di seguito:")
            .addField(":beginner: Privilegi", textPrivilegi)

        message.author.send(embed)
    },
};
