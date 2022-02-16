const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont("./canvas/font/roboto.ttf", { family: "roboto" })
registerFont("./canvas/font/robotoBold.ttf", { family: "robotoBold" })

module.exports = {
    name: "birthday",
    aliases: ["compleanno"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare e settare il compleanno di un utente",
    syntax: "!birthday (user)",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var utente = message.author;
        }
        else {
            var utente = message.mentions.users?.first()
            if (!utente) {
                var utente = await getUser(args.join(" "))
            }
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utente.user) utente = utente.user

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non un bot", "Non puoi visualizzare il compleanno di un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        var embed = new Discord.MessageEmbed()
            .setTitle(`Birthday - ${utente.nickname ? utente.nickname : utente.username}`)

        if (!userstats.birthday || !userstats.birthday[0]) {
            embed
                .setColor("#919191")
                .setThumbnail("https://i.postimg.cc/43g1YkLN/birthday-Not-Setted.png")
            if (utente.id == message.author.id) {
                embed
                    .addField(`:grey_exclamation: Not setted`, `_Non hai ancora inserito il tuo compleanno_\rSe setterai il giorno del tuo compleanno, riceverai **auguri** e tanti **regali** personallizati. Fallo subito con il comando \`!setbirthday [month] [day]\``)
            }
            else {
                embed
                    .addField(`:grey_exclamation: Not setted`, `_Questo utente non ha ancora inserito il suo compleanno_`)
            }
            message.channel.send({ embeds: [embed] })
                .catch(() => { })
        }
        else {
            if ((new Date().getMonth() == userstats.birthday[0] - 1 && new Date().getDate() == userstats.birthday[1]) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && new Date().getMonth() == 2 && new Date.getMonth() == 1 && !isAnnoBisestile(new Date().getFullYear()))) {
                var canvas = await createCanvas(400, 400)
                var ctx = await canvas.getContext('2d')

                var img = await loadImage("./canvas/img/birthdayToday.png")
                ctx.drawImage(img, 0, 0)

                ctx.textBaseline = 'middle';
                ctx.font = "75px robotoBold"
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase()).width / 2, 105);

                ctx.font = "185px robotoBold"
                ctx.fillStyle = "#303030";
                ctx.fillText(userstats.birthday[1], canvas.width / 2 - ctx.measureText(userstats.birthday[1]).width / 2, 247);

                var img = await loadImage("./canvas/img/birthdayDecorations.png")
                ctx.drawImage(img, 0, 0)

                embed
                    .setColor("#FF1180")
                    .setThumbnail("attachment://canvas.png")
                    .addField(`:gift: ${userstats.birthday[1]} ${moment().set("month", userstats.birthday[0] - 1).format("MMMM")}`, `**Oggi** è il compleanno di ${utente.toString()}\rFategli gli auguri e tanti regali`)
            }
            else {
                var canvas = await createCanvas(400, 400)
                var ctx = await canvas.getContext('2d')

                var img = await loadImage("./canvas/img/birthday.png")
                ctx.drawImage(img, 0, 0)

                ctx.textBaseline = 'middle';
                ctx.font = "75px robotoBold"
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase()).width / 2, 105);

                ctx.font = "185px robotoBold"
                ctx.fillStyle = "#303030";
                ctx.fillText(userstats.birthday[1], canvas.width / 2 - ctx.measureText(userstats.birthday[1]).width / 2, 247);

                embed
                    .setColor("#FB1B3A")
                    .setThumbnail("attachment://canvas.png")

                if (moment(prossimoBirthday(userstats.birthday[0], userstats.birthday[1])).diff(moment(), "days") + 1 == 1) {
                    embed.addField(`:balloon: ${userstats.birthday[1]} ${moment().set("month", userstats.birthday[0] - 1).format("MMMM")}`, `Manca **${moment(prossimoBirthday(userstats.birthday[0], userstats.birthday[1])).diff(moment(), "days") + 1} giorno** al compleanno di ${utente.toString()}`)
                }
                else
                    embed.addField(`:balloon: ${userstats.birthday[1]} ${moment().set("month", userstats.birthday[0] - 1).format("MMMM")}`, `Mancano **${moment(prossimoBirthday(userstats.birthday[0], userstats.birthday[1])).diff(moment(), "days") + 1} giorni** al compleanno di ${utente.toString()}`)
            }

            message.channel.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
                .catch(() => { })
        }
    },
};