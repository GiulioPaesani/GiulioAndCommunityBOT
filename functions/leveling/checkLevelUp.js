const moment = require("moment")
const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const items = require("../../config/ranking/items.json")
const levelColor = require("../../config/ranking/levelColor.json")
const illustrations = require("../../config/general/illustrations.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getXpNecessari } = require("../../functions/leveling/getXpNecessari")
const { createCanvas, loadImage } = require('canvas')
const { getEmoji } = require("../../functions/general/getEmoji")
const { checkUserLevelRole } = require("../../functions/leveling/checkLevelRoles")

const checkLevelUp = async (client, userstats) => {
    // const privilegiLevel = { //Modificare i privilegi
    //     "5": [
    //         `Streaming nelle chat vocali`,
    //         `Aggiungere **reazioni** ai messaggi`,//Rimosso
    //         `Allegare **file** nelle chat`,//Rimosso
    //         `Creare **stanze private testuali** in <#${settings.idCanaliServer.privateRooms}>`,//Rimosso
    //         `Nuove **emoji**: ${getEmoji(client, "Giulio")} ${getEmoji(client, "GiulioBacio")} ${getEmoji(client, "GiulioOK")}`
    //     ],
    //     "10": [
    //         `Creare **stanze private vocali** in <#${settings.idCanaliServer.privateRooms}>`,//Rimosso
    //         `Nuove **emoji**: ${getEmoji(client, "GiulioAngry")} ${getEmoji(client, "GiulioGG")} ${getEmoji(client, "GiulioHappy")}`
    //     ],
    //     "15": [
    //         `Scrivere in chat <#${settings.idCanaliServer.noMicChat}> per utilizzare **KDBot**`,//Rimosso
    //         `Creare **stanze private vocali** in <#${settings.idCanaliServer.privateRooms}>`,//Rimosso
    //         `Cambiare il proprio **nickname**`,
    //     ],
    //     "20": [
    //         `Creare **stanze private testuali+vocali**  in <#${settings.idCanaliServer.privateRooms}>`,
    //         `Nuove **emoji**: ${getEmoji(client, "GiulioPiangere")} ${getEmoji(client, "GiulioBuonanotte")} ${getEmoji(client, "GiulioSus")} ${getEmoji(client, "GiulioLove")}`
    //     ],
    //     "25": [
    //         `10% di **boost** di esperienza nel livellamento`,
    //         `Nuove **emoji**: ${getEmoji(client, "GiulioBan")} ${getEmoji(client, "GiulioCool")} ${getEmoji(client, "GiulioCringe")} ${getEmoji(client, "GiulioF")} ${getEmoji(client, "GiulioRip")}`
    //     ],
    //     "30": [
    //         `Scrivere nella chat <#${settings.idCanaliServer.selfAdv}>`,
    //         `Nuove **emoji**: ${getEmoji(client, "GiulioLOL")} ${getEmoji(client, "GiulioHi")}`
    //     ],
    //     "35": [
    //         `Nuove **emoji**: ${getEmoji(client, "GiulioWow")} ${getEmoji(client, "GiulioCattivo")} ${getEmoji(client, "GiulioSad")} ${getEmoji(client, "GiulioLive")}`
    //     ],
    //     "40": [
    //         `Nuove **emoji**: ${getEmoji(client, "GiulioPopCorn")} ${getEmoji(client, "GiulioPaura")} ${getEmoji(client, "GiulioDomandoso")} ${getEmoji(client, "GiulioFesta")}`
    //     ],
    //     "50": [
    //         `20% di **boost** di esperienza nel livellamento`,
    //     ],
    //     "100": [
    //         `**Priorità di parola** nella chat vocali`,
    //     ],
    // }

    const privilegiLevel = {
        5: [
            `**Streaming** nelle chat vocali`,
            `Nuove **emoji**: ${getEmoji(client, "GiulioLOL")} ${getEmoji(client, "GiulioCool")} ${getEmoji(client, "GiulioLove")} ${getEmoji(client, "GiulioImbarazzato")} ${getEmoji(client, "GiulioPaura")} ${getEmoji(client, "GiulioAngry")}`
        ],
        10: [
            `Creare **stanze private testuali** in <#${settings.idCanaliServer.privateRooms}>`,
            `Creare **sondaggi** con \`/poll\``,
            `Nuove **emoji**: ${getEmoji(client, "GiulioBan")} ${getEmoji(client, "GiulioBuonanotte")} ${getEmoji(client, "GiulioGG")} ${getEmoji(client, "GiulioHelp")} ${getEmoji(client, "GiulioOK")} ${getEmoji(client, "GiulioWow")}`
        ],
        15: [
            `Cambiare il proprio **nickname** (anche con \`/nickname\`)`,
            `Far **scrivere** al bot ciò che si vuole con \`/say\``,
            `Selezionare ciò che gli utenti **possono** o **non possono** mandare nella tua stanza privata con \`/pmode\``,
            `Giocare a <#${settings.idCanaliServer.countingplus}> e divertirsi con gli utenti a **contare** in modo strano`,
            `Usare \`'[testo]\` in <#${settings.idCanaliServer.noMicChat}> per **parlare** con gli utenti in vocale scrivendo`
        ],
        20: [
            `Creare **stanze private vocali** in <#${settings.idCanaliServer.privateRooms}>`,
            `Giocare a <#${settings.idCanaliServer.onewordstory}> e scrivere con gli utenti una **storia divertente**`,
            `Nuove **emoji**: ${getEmoji(client, "GiulioCattivo")} ${getEmoji(client, "GiulioGasato")} ${getEmoji(client, "GiulioHi")} ${getEmoji(client, "GiulioLive")} ${getEmoji(client, "GiulioNo")} ${getEmoji(client, "GiulioYes")} ${getEmoji(client, "GiulioRip")}`
        ],
        25: [
            `Creare un **messaggio di invito** per le tue stanze private con \`/pinvite\``,
            `Ideare **meme** super divertenti con \`/image\``,
        ],
        30: [
            `Scrivere dei **testi strani** con \`/clap\``,
            `Pubblicare un tuo progetto in <#${settings.idCanaliServer.ourProjects}> con \`/post\` (e comparire se vuoi nella serie "I vostri super progetti")`,
            `Nuove **emoji**: ${getEmoji(client, "GiulioCringe")} ${getEmoji(client, "GiulioDomandoso")} ${getEmoji(client, "GiulioFesta")} ${getEmoji(client, "GiulioOcchioloni")} ${getEmoji(client, "GiulioPopCorn")} ${getEmoji(client, "GiulioSus")}`
        ],
        40: [
            `Applicare **effetti bizzarri** alla musica che stai ascoltando con \`/effect\``,
            `Aggiungre altri **proprietari** alla tua stanza privata con \`/padmin\``
        ],
        50: [
            `Fare il **karaoke** con le canzoni che stai ascoltando con \`/lyrics\``,
            `Nuove **emoji**: ${getEmoji(client, "GiulioCuoriBlue")} ${getEmoji(client, "GiulioEasy")} ${getEmoji(client, "GiulioF")} ${getEmoji(client, "GiulioNausea")} ${getEmoji(client, "GiulioRicco")} ${getEmoji(client, "GiulioSaiyan")} ${getEmoji(client, "GiulioSconvolto")}`
        ],
        60: [
            `Fare **scrivere** al bot ciò che si vuole in tutti i canali con \`/say\``
        ],
    }

    let level = 0

    while (userstats.leveling.xp >= getXpNecessari(level + 1)) {
        level++
    }

    if (userstats.leveling.level != level) {
        let textPrivilegi = `+${level * 10} Coins\n`

        if (client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${level}`)) {
            textPrivilegi += `Ruolo @Level ${level}\n`
        }

        if (privilegiLevel[level])
            privilegiLevel[level].forEach(privilegio => {
                textPrivilegi += `${privilegio}\n`
            })

        let textItems = ""
        items.forEach(item => {
            if (item.priviled && item.priviled == level) {
                textItems += `${getEmoji(client, item.name.toLowerCase())} `
            }
        })
        if (textItems != "")
            textPrivilegi += `Nuovi oggetti nello **shop**: ${textItems}\n`

        let nextPrivilegi;
        for (let i = level + 1; i <= parseInt(Object.keys(privilegiLevel)[Object.keys(privilegiLevel).length - 1]); i++) {
            if (!nextPrivilegi && privilegiLevel[i])
                nextPrivilegi = i
        }

        if (!userstats.leveling.livelliSuperati) {
            userstats.leveling.livelliSuperati = {}

            for (let i = 1; i <= userstats.leveling.level; i++) {
                userstats.leveling.livelliSuperati[i] = true
            }
        }

        if (!userstats.leveling.livelliSuperati[level] && level > 0) {
            let messages = ["Hai sprecato il tuo tempo per raggiungere un livello superiore",
                "Congratulazioni, ora la tua vita ha finalmente un senso",
                "Sei fortissimo, hai finalmente raggiunto un grande obbiettivo della tua vita",
                "Un nuovo livello, nuovi privilegi, un colore bellissimo, la tua vita è ora un successo",
                "Grande! Ora si che la tua vita ha un senso",
                "Hai veramente sprecato tutto questo tempo per raggiungere un nuovo livello?",
                "Mi spiace, devi avere una vita molto triste per essere arrivato a questo punto",
                "Ma esci un po' invece di salire di livello",
                "Si vede che sei un utente attivo, continua così!",
                "Forza, l'obbiettivo è livello 1000!!",
                "Che figo, hai superato un nuovo livello",
                "Ma sei fortissimo, come hai fatto a raggiungere questo livello così velocemente?",
                "Bravissimo! Ma forse è meglio che torni a studiare...",
                "Tutto questo tempo per raggiungere solo questo livello? Ma sei scarsissimo",
                "Invece di superare i livelli, forse è meglio che torni a lavorare...",
                "Grandissimo! Siamo tutti inividiosi del livello che hai raggiunto"]

            let canvas = await createCanvas(400, 400)
            let ctx = await canvas.getContext('2d')

            let img = await loadImage(illustrations.levelUp)
            ctx.drawImage(img, 0, 0, 400, 400)

            ctx.globalCompositeOperation = "source-in";

            if (level >= 5) {
                ctx.fillStyle = levelColor[level];
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            let embed = new Discord.MessageEmbed()
                .setTitle(`New level - LEVEL ${level}`)
                .setDescription(messages[Math.floor(Math.random() * messages.length)])
                .setColor(levelColor[level])
                .setThumbnail("attachment://canvas.png")
                .addField(`:gift: Privilegi e regali ottenuti`, textPrivilegi)
            if (nextPrivilegi)
                embed.setFooter({ text: `Prossimi privilegi al livello ${nextPrivilegi}` })

            client.users.cache.get(userstats.id).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
                .catch(() => { })
        }
        else {
            textPrivilegi = "_Nessun privilegio - Livello già superato_"
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":beginner: Level up :beginner:")
            .setColor(colors.purple)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${client.users.cache.get(userstats.id)?.toString()} - ID: ${userstats.id}`)
            .addField(":beginner: Level", level.toString())
            .addField(":gem: Privilegi", textPrivilegi)

        if (!isMaintenance() && level > 0)
            client.channels.cache.get(log.ranking.levelUp).send({ embeds: [embed] })

        if (!userstats.leveling.livelliSuperati[level])
            userstats.economy.money += level * 10

        userstats.leveling.level = level

        userstats.leveling.livelliSuperati[level] = true
    }

    checkUserLevelRole(client, userstats)

    return userstats
}

module.exports = { checkLevelUp }