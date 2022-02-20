const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont("./canvas/font/roboto.ttf", { family: "roboto" })
registerFont("./canvas/font/robotoBold.ttf", { family: "robotoBold" })

module.exports = {
    name: "setbirthday",
    aliases: ["setcompleanno"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Settare la data del proprio compleanno",
    syntax: "!setbirthday [month] [day]",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (userstats.birthday && userstats.birthday[0]) {
            return botCommandMessage(message, "Warning", "Compleanno già inserito", "Hai già settato il tuo compleanno, non puoi più **modificarlo**")
        }

        if (!args[0] || !args[1]) {
            return botCommandMessage(message, "Error", "Inserire una data valida", "Scrivi la data valida del tuo compleanno", property)
        }

        var month = args[0].toLowerCase()
        var day = args[1].toLowerCase()

        if (["gen", "gennaio", "jan", "january"].includes(month)) month = 1
        if (["feb", "febbraio", "february"].includes(month)) month = 2
        if (["mar", "marzo", "march"].includes(month)) month = 3
        if (["apr", "aprile", "april"].includes(month)) month = 4
        if (["mag", "maggio", "may"].includes(month)) month = 5
        if (["giu", "giugno", "jun", "june"].includes(month)) month = 6
        if (["lug", "luglio", "jul", "july"].includes(month)) month = 7
        if (["ago", "agosto", "aug", "august"].includes(month)) month = 8
        if (["set", "settembre", "sep", "september"].includes(month)) month = 9
        if (["ott", "ottobre", "oct", "october"].includes(month)) month = 10
        if (["nov", "novembre", "november"].includes(month)) month = 11
        if (["dic", "dicembre", "dec", "december"].includes(month)) month = 12

        month = parseInt(month)
        day = parseInt(day)

        if (!moment([2020, month - 1, day]).isValid() || (!moment([2020, month - 1, day]).isValid() && moment([2021, month - 1, day]).isValid())) {
            return botCommandMessage(message, "Error", "Inserire una data valida", "Scrivi la data valida del tuo compleanno", property)
        }

        var canvas = await createCanvas(400, 400)
        var ctx = await canvas.getContext('2d')

        var img = await loadImage("./canvas/img/birthday.png")
        ctx.drawImage(img, 0, 0)

        ctx.textBaseline = 'middle';
        ctx.font = "75px robotoBold"
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(moment([2000, month - 1, day]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, month - 1, day]).format("MMM").toUpperCase()).width / 2, 105);

        ctx.font = "185px robotoBold"
        ctx.fillStyle = "#303030";
        ctx.fillText(day, canvas.width / 2 - ctx.measureText(day).width / 2, 247);

        var embed = new Discord.MessageEmbed()
            .setTitle("Confermi compleanno?")
            .setColor("#ebaa13")
            .setThumbnail("attachment://canvas.png")
            .setDescription("**Confermi** il complenno che hai inserito?")
            .addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, "Se vuoi **rinserire** la data, riscrivi il comando `!setbirthday` altrimenti clicca su **\"Conferma compleanno\"** per inserire quella seleziona\r_Non potrai più modificare la data del tuo compleanno_")

        var button1 = new Discord.MessageButton()
            .setLabel("Annulla inserimento")
            .setStyle("DANGER")
            .setCustomId(`annullaCompleanno,${message.author.id}`)

        var button2 = new Discord.MessageButton()
            .setLabel("Conferma compleanno")
            .setStyle("SUCCESS")
            .setCustomId(`confermaCompleanno,${message.author.id},${month},${day}`)

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        message.channel.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')], components: [row] })
            .then(msg => {
                setTimeout(() => msg.delete(), 60000)
                setTimeout(() => message.delete(), 60000)
            })
            .catch(() => { })
    },
};