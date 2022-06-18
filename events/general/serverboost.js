const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")
const items = require("../../config/ranking/items.json")
const illustrations = require("../../config/general/illustrations.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return
        if (message.guild?.id != settings.idServer) return

        if (message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" && message.type != "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3") return

        let numeroBoost;
        if (message.content == "")
            numeroBoost = 1;
        else
            numeroBoost = parseInt(message.content)

        let livelloVecchio;
        let nuovoLivello;
        if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3") {
            nuovoLivello = `:crystal_ball: **LIVELLO 3 sbloccato**
+100 emoji
+30 sticker
Qualità audio 384 Kpms
Vanity URL
100 MB limite di caricamenti in chat
Banner del server animato`
        }
        else if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2") {
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
        else if (message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1") {
            nuovoLivello = `:crystal_ball: **LIVELLO 1 sbloccato**
+50 emoji
+15 sticker
Qualità audio 128 Kpms
Icona server animata
Sfondo inviti
Streaming fino a 720p`
        }

        if (message.guild.premiumSubscriptionCount - numeroBoost < 2) {
            livelloVecchio = 0
        }
        else if (message.guild.premiumSubscriptionCount - numeroBoost < 7) {
            livelloVecchio = 1
        }
        else if (message.guild.premiumSubscriptionCount - numeroBoost < 14) {
            livelloVecchio = 2
        }
        else {
            livelloVecchio = 3
        }

        let livelloNuovo
        switch (message.guild.premiumTier) {
            case "NONE": livelloNuovo = 0; break;
            case "TIER_1": livelloNuovo = 1; break;
            case "TIER_2": livelloNuovo = 2; break;
            case "TIER_3": livelloNuovo = 3; break;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":tada: Serverboost :tada:")
            .setColor(colors.serverboost)
            .setDescription(`Grazie tantissime a <@${message.author.id}> per aver boostato il server!`)
            .addField(`Ha potenziato il server con ${numeroBoost} boost`, `\`Lvl. ${livelloNuovo} Boost ${message.guild.premiumSubscriptionCount}\`

${nuovoLivello ? nuovoLivello : ""}
`)

        let canale = client.channels.cache.get(settings.idCanaliServer.general);
        canale.send({ embeds: [embed] });

        embed = new Discord.MessageEmbed()
            .setTitle(":fleur_de_lis: Serverboost :fleur_de_lis:")
            .setColor(colors.purple)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ${message.author.tag}\nID: ${message.author.id}`)
            .addField(":ballot_box: Count", `${numeroBoost} boost`)
            .addField(":beginner: Server level", `
Old: Lvl. ${livelloVecchio} Boost ${message.guild.premiumSubscriptionCount - numeroBoost}
New: Lvl. ${livelloNuovo} Boost ${message.guild.premiumSubscriptionCount}`)

        if (!isMaintenance())
            client.channels.cache.get(log.server.serverBoostes).send({ embeds: [embed] })

        let textItems = ""
        items.filter(x => x.priviled && x.priviled <= 30 && getEmoji(client, x.name.toLowerCase()) != "").slice(0, 6).forEach(item => {
            textItems += `${getEmoji(client, item.name.toLowerCase())} `
        })

        let textPrivilegi = `
Ruolo @Server Booster
Creare **sondaggi** con \`/poll\`
Creare **stanze private testuali** e **vocali** in <#${settings.idCanaliServer.privateRooms}>
Giocare a <#${settings.idCanaliServer.countingplus}> e <#${settings.idCanaliServer.onewordstory}> per divertirsi con gli utenti
Ideare **meme** super divertenti con \`/image\`
Pubblicare un tuo progetto in <#${settings.idCanaliServer.ourProjects}> con \`/post\` (e comparire se vuoi nella serie "I vostri super progetti")
Emoji **eslusiva**: ${getEmoji(client, "GiulioBoost")}
Nuove **emoji** tra cui ${getEmoji(client, "GiulioCool")} ${getEmoji(client, "GiulioImbarazzato")} ${getEmoji(client, "GiulioAngry")} ${getEmoji(client, "GiulioSus")} ${getEmoji(client, "GiulioCringe")} ${getEmoji(client, "GiulioGG")} e molte altre...
Nuovi oggetti nello **shop** tra cui ${textItems} e molti altri...
_E tantissimi altri privilegi..._`

        embed = new Discord.MessageEmbed()
            .setTitle(":tada: Grazie per il boost!")
            .setColor(colors.serverboost)
            .setThumbnail(illustrations.serverboost)
            .setDescription("Grazie mille per aver boostato il server\nPer tutto il periodo di boost avrai accesso a tutti i **privilegi** che trovi di seguito:")
            .addField(":gem: Privilegi", textPrivilegi)

        message.author.send({ embeds: [embed] })
    },
};
