const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont("./canvas/font/roboto.ttf", { family: "roboto" })
registerFont("./canvas/font/robotoBold.ttf", { family: "robotoBold" })

module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("confermaCompleanno")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        if (userstats.birthday && userstats.birthday[0]) {
            button.message.delete()
                .catch(() => { })
            return botMessage(button.user, "Warning", "Compleanno già inserito", "Hai già settato il tuo compleanno, non puoi più **modificarlo**")
        }
        else {
            var data = new Date()

            var day = parseInt(button.customId.split(",")[3])
            var month = parseInt(button.customId.split(",")[2])

            userstats.birthday = [month, day]
            userstatsList[userstatsList.findIndex(x => x.id == button.user.id)] = userstats

            var embed = new Discord.MessageEmbed()
                .setTitle("Compleanno inserito")
                .setColor("#FB1B3A")
                .setThumbnail("attachment://canvas.png")

            if (month == 2 && day == 29)
                embed.setDescription(`${button.user.toString()} hai inserito correttamente la data del tuo compleanno. Aspetta che arrivi per riceve **auguri** e **regali**\r_Negli anni non bisestili il tuo compleanno sarà contato il 1 Marzo_`)
            else
                embed.setDescription(`${button.user.toString()} hai inserito correttamente la data del tuo compleanno. Aspetta che arrivi per riceve **auguri** e **regali**`)

            if (moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1 == 1) {
                embed.addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, `Manca **${moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1} giorno** al tuo compleanno`)
            }
            else
                embed.addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, `Mancano **${moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1} giorni** al tuo compleanno`)

            button.message.edit({ embeds: [embed], components: [] })

            var embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Birthday added :pencil:")
                .setColor("#22c90c")
                .setDescription(`[Message link](https://discord.com/channels/${button.guild.id}/${button.message.channel.id}/${button.message.id})`)
                .addField(":alarm_clock: Time", `${moment(button.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${button.user.toString()} - ID: ${button.user.id}`)
                .addField("Date", `${day} ${moment().set("month", month - 1).format("MMMM")}`)

            if (!isMaintenance())
                client.channels.cache.get(log.birthday.setBirthday).send({ embeds: [embed] })

            if (data.getHours() < 8) return

            if (userstats.birthday && ((userstats.birthday[0] == data.getMonth() + 1 && userstats.birthday[1] == data.getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && data.getMonth() == 2 && data.getDate() == 1))) {
                var canvas = await createCanvas(400, 400)
                var ctx = await canvas.getContext('2d')

                var img = await loadImage("./canvas/img/birthdayToday.png")
                ctx.drawImage(img, 0, 0)

                ctx.textBaseline = 'middle';
                ctx.font = "75px robotoBold"
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase()).width / 2, 105);

                ctx.font = "185px robotoBold"
                ctx.fillStyle = "#303030";
                ctx.fillText(data.getDate(), canvas.width / 2 - ctx.measureText(data.getDate()).width / 2, 247);

                var img = await loadImage("./canvas/img/birthdayDecorations.png")
                ctx.drawImage(img, 0, 0)

                var items = require("../../../config/items.json")
                var randomItems = []
                for (var i = 1; i <= 4; i++) {
                    randomItems.push(items[Math.floor(Math.random() * items.length)])
                    items = items.filter(x => x != randomItems[randomItems.length - 1])
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle(":tada: Happy birthday! :tada:")
                    .setColor("#FF1180")
                    .setThumbnail("attachment://canvas.png")
                    .setDescription("Tanti auguri di **buon compleanno**, goditi subito questi fantastici **regali**")
                    .addField(":gift: I tuoi regali", `
- +${userstats.level * 40} XP
- +${userstats.level * 10} Coins
- 4 oggetti random dallo **shop** ${randomItems.map(x => x.icon).join(" ")}
- **Boost x2** livellamento per tutto il giorno`)

                client.users.cache.get(userstats.id).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
                    .catch(() => { })

                userstats = await addXp(userstats, userstats.level * 40, 0);
                userstats.coins += userstats.level * 10
                randomItems.forEach(item => {
                    userstats.inventory[item.id] = !userstats.inventory[item.id] ? 1 : (userstats.inventory[item.id] + 1)
                })

                userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

                client.channels.cache.get(log.birthday.birthdaysToday).messages.fetch({ limit: 10 })
                    .then(messages => {
                        for (var msg of messages) {
                            var msg = msg[1]
                            if (msg.embeds[0]?.fields[0]?.value == moment(data.getTime()).format("ddd DD MMM YYYY")) {
                                msg.embeds[0].fields[1].value += `- ${button.user.toString()}\r`

                                if (!isMaintenance())
                                    msg.edit({ embeds: [msg.embeds[0]] })
                            }
                            else {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle(":gift: Birthdays today :gift:")
                                    .setColor("#8227cc")
                                    .addField(":alarm_clock: Day", `${moment(data.getTime()).format("ddd DD MMM YYYY")}`, false)
                                    .addField("Birthdays", `- ${button.user.toString()}\r`)

                                if (!isMaintenance())
                                    client.channels.cache.get(log.birthday.birthdaysToday).send({ embeds: [embed] })
                            }
                        }
                    })
            }
        }
    },
};
