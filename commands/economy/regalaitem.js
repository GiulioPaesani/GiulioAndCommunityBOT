const { createCanvas, loadImage, registerFont } = require('canvas')

module.exports = {
    name: "regalaitem",
    aliases: ["giftitem"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Regalare item del proprio inventario a un utente",
    syntax: "!regalaitem [user] [item]",
    category: "ranking",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "), args.slice(0, -1).join(" "))
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (message.author.id == utente.id) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi regalarti item da solo")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi regalare item ad un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!args[args.length - 1]) {
            return botCommandMessage(message, "Error", "Inserire un item", "Scrivi l'oggetto che vuoi regalare all'utente", property)
        }

        var oggetto = args[args.length - 1].toLowerCase()

        var item = require("../../config/items.json").find(x => x.name.toLowerCase() == oggetto || x.id == oggetto || x.id == oggetto.slice(1) || x.alias.includes(oggetto))

        if (!item) {
            return botCommandMessage(message, "Error", "Oggetto non trovato", "Hai inserito un oggetto non valido o non esistente", property)
        }

        var userstats2 = userstatsList.find(x => x.id == message.author.id);
        if (!userstats2) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!userstats2.inventory[item.id] || userstats2.inventory[item.id] == 0) {
            return botCommandMessage(message, "Warning", "Non hai questo item", "Non hai questo oggetto nell'inventario per regalarlo a un utente")
        }

        userstats.inventory[item.id] = (!userstats.inventory[item.id] ? 0 : userstats.inventory[item.id]) + 1
        userstats2.inventory[item.id]--

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        userstatsList[userstatsList.findIndex(x => x.id == userstats2.id)] = userstats2

        var canvas = await createCanvas(400, 400)
        var ctx = await canvas.getContext('2d')

        var img = await loadImage(`https://cdn.discordapp.com/emojis/${item.icon.split(":")[2].slice(0, -1)}.png?size=128`)
        ctx.drawImage(img, canvas.width / 2 - 100 / 2 - 60, canvas.height / 2 - 30 / 2 - 100, 100, 100)

        var img = await loadImage("https://i.postimg.cc/qqH175Sv/giftempty.png")
        ctx.drawImage(img, canvas.width / 2 - 350 / 2, canvas.height / 2 - 350 / 2, 350, 350)

        var embed = new Discord.MessageEmbed()
            .setTitle("Regalo inviato")
            .setThumbnail("attachment://canvas.png")
            .setColor("#FF3E75")
            .setDescription(`Hai regalato con successo l'oggetto ${item.icon}**${item.name}** a ${utente.toString()}`)

        message.channel.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })

        var embed = new Discord.MessageEmbed()
            .setTitle("Un piccolo regalo per te")
            .setThumbnail("attachment://canvas.png")
            .setColor("#FF3E75")
            .setDescription(`${message.author.toString()} ti ha regalato l'oggetto ${item.icon}**${item.name}**\rGoditi questo bellissimo item`)

        utente.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
            .catch(() => { })
    },
};
