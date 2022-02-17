const { createCanvas, loadImage, registerFont } = require('canvas')

global.getXpNecessari = function (level) {
    var xp = 0;

    for (var i = 0; i <= level; i++) {
        xp += 50 * i
        if (i > 15)
            xp += 40 * (i - 15)
    }

    return xp
}

global.setLevelRole = async function (utente, level) {
    var member = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == utente.id)

    var ruoloDaAvere = "";
    if (level >= 200)
        ruoloDaAvere = settings.ruoliLeveling.level200
    else if (level >= 150)
        ruoloDaAvere = settings.ruoliLeveling.level150
    else if (level >= 100)
        ruoloDaAvere = settings.ruoliLeveling.level100
    else if (level >= 90)
        ruoloDaAvere = settings.ruoliLeveling.level90
    else if (level >= 80)
        ruoloDaAvere = settings.ruoliLeveling.level80
    else if (level >= 70)
        ruoloDaAvere = settings.ruoliLeveling.level70
    else if (level >= 60)
        ruoloDaAvere = settings.ruoliLeveling.level60
    else if (level >= 50)
        ruoloDaAvere = settings.ruoliLeveling.level50
    else if (level >= 45)
        ruoloDaAvere = settings.ruoliLeveling.level45
    else if (level >= 40)
        ruoloDaAvere = settings.ruoliLeveling.level40
    else if (level >= 35)
        ruoloDaAvere = settings.ruoliLeveling.level35
    else if (level >= 30)
        ruoloDaAvere = settings.ruoliLeveling.level30
    else if (level >= 25)
        ruoloDaAvere = settings.ruoliLeveling.level25
    else if (level >= 20)
        ruoloDaAvere = settings.ruoliLeveling.level20
    else if (level >= 15)
        ruoloDaAvere = settings.ruoliLeveling.level15
    else if (level >= 10)
        ruoloDaAvere = settings.ruoliLeveling.level10
    else if (level >= 5)
        ruoloDaAvere = settings.ruoliLeveling.level5

    if (ruoloDaAvere != "") {
        if (!member.roles.cache.has(ruoloDaAvere)) {
            await member.roles.add(ruoloDaAvere)
        }
    }

    for (var ruolo in settings.ruoliLeveling) {
        if (member.roles.cache.has(settings.ruoliLeveling[ruolo]) && settings.ruoliLeveling[ruolo] != ruoloDaAvere) {
            await member.roles.remove(settings.ruoliLeveling[ruolo])
        }
    }
}

global.addXp = async function (userstats, xp, boost, notSendMessage) {
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
            `Creare **stanze private vocali** in <#${settings.idCanaliServer.privateRooms}>`,
            `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioAngry")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioGG")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioHappy")}`
        ],
        "15": [
            `Scrivere in chat <#${settings.idCanaliServer.noMicChat}> per utilizzare **KDBot**`,
            `Creare **stanze private vocali** in <#${settings.idCanaliServer.privateRooms}>`,
            `Cambiare il proprio **nickname**`,
            `Utilizzare il comando \`!say\``,
        ],
        "20": [
            `Creare **stanze private testuali+vocali**  in <#${settings.idCanaliServer.privateRooms}>`,
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
            `Nuove **emoji**: ${client.emojis.cache.find(emoji => emoji.name === "GiulioWow")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioCattivo")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioSad")} ${client.emojis.cache.find(emoji => emoji.name === "GiulioLive")}`
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

    userstats.xp += xp

    if (boost) userstats.xp += xp / 100 * boost

    var level = 0

    while (userstats.xp >= getXpNecessari(level + 1)) {
        level++
    }

    console.log("ciao1")
    if (userstats.level != level) {
        var textPrivilegi = `+${level * 10} Coins\r`

        if (settings.ruoliLeveling["level" + level]) {
            textPrivilegi += `Ruolo @Level ${level}\r`
        }

        if (privilegiLevel[level])
            privilegiLevel[level].forEach(privilegio => {
                textPrivilegi += `${privilegio}\r`
            })

        var items = require("../config/items.json")
        var textItems = ""
        items.forEach(item => {
            if (item.priviled && item.priviled == level) {
                textItems += `${item.icon} `
            }
        })
        if (textItems != "")
            textPrivilegi += `Nuovi oggetti nello **shop**: ${textItems}\r`

        var nextPrivilegi;
        for (var i = level + 1; i <= parseInt(Object.keys(privilegiLevel)[Object.keys(privilegiLevel).length - 1]); i++) {
            if (!nextPrivilegi && privilegiLevel[i])
                nextPrivilegi = i
        }

        if (!userstats.livelliSuperati) {
            userstats.livelliSuperati = {}

            for (var i = 1; i <= userstats.level; i++) {
                userstats.livelliSuperati[i] = true
            }
        }

        if (!userstats.livelliSuperati[level]) {
            var messages = ["Hai sprecato il tuo tempo per raggiungere un livello superiore", "Congratulazioni, ora la tua vita ha finalmente un senso", "Sei fortissimo, hai finalmente raggiunto un grande obbiettivo della tua vita", "Un nuovo livello, nuovi privilegi, un colore bellissimo, la tua vita è ora un successo", "Grande! Ora si che la tua vita ha un senso", "Hai veramente sprecato tutto questo tempo per raggiungere un nuovo livello?", "Mi spiace, devi avere una vita molto triste per essere arrivato a questo punto", "Ma esci un po' invece di salire di livello"]

            const levelColor = require("../config/levelColor.json")

            var canvas = await createCanvas(400, 400)
            var ctx = await canvas.getContext('2d')

            var img = await loadImage("https://i.postimg.cc/qR6hRRc0/LevelUp.png")
            ctx.drawImage(img, 0, 0, 400, 400)

            ctx.globalCompositeOperation = "source-in";

            if (level >= 5) {
                ctx.fillStyle = levelColor[level];
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            var embed = new Discord.MessageEmbed()
                .setTitle(`New level - LEVEL ${level}`)
                .setDescription(messages[Math.floor(Math.random() * messages.length)])
                .setColor(levelColor[level])
                .setThumbnail("attachment://canvas.png")
                .addField(`:gift: Privilegi e regali ottenuti`, textPrivilegi)
            if (nextPrivilegi)
                embed.setFooter(`Prossimi privilegi al livello ${nextPrivilegi}`)

            client.users.cache.get(userstats.id).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
                .catch(() => { })
        }
        else {
            textPrivilegi = "_Nessun privilegio - Livello già superato_"
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":beginner: Level up :beginner:")
            .setColor("#8227cc")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${client.users.cache.get(userstats.id).toString()} - ID: ${userstats.id}`, false)
            .addField("Level", level.toString())
            .addField("Privilegi", textPrivilegi)

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.levelUp).send({ embeds: [embed] })

        if (!userstats.livelliSuperati[level])
            userstats.money += level * 10

        userstats.level = level

        userstats.livelliSuperati[level] = true
    }

    setLevelRole({ id: userstats.id }, userstats.level)

    return userstats
}