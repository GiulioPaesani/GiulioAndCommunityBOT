const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const illustrations = require("../../../config/general/illustrations.json")
const items = require("../../../config/ranking/items.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getUser } = require("../../../functions/database/getUser")
const { updateUser } = require("../../../functions/database/updateUser")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { createCanvas, loadImage } = require('canvas')
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels")
const { clientFun } = require("../../../index.js")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaCompleanno")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstats = getUser(interaction.user.id)

        if (userstats.birthday && userstats.birthday[0]) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Compleanno già inserito")
                .setColor(colors.gray)
                .setThumbnail("attachment://canvas.png")
                .setDescription("Hai già settato il tuo compleanno, non puoi più **modificarlo**")

            interaction.message.edit({ embeds: [embed], components: [] })

            setTimeout(() => {
                interaction.message.delete()
            }, 1000 * 20)
        }
        else {
            let data = new Date()

            let day = parseInt(interaction.customId.split(",")[3])
            let month = parseInt(interaction.customId.split(",")[2])

            userstats.birthday = [month, day]
            updateUser(userstats)

            let embed = new Discord.MessageEmbed()
                .setTitle("Compleanno inserito")
                .setColor(colors.red)
                .setThumbnail("attachment://canvas.png")

            if (month == 2 && day == 29)
                embed.setDescription(`${interaction.user.toString()} hai inserito correttamente la data del tuo compleanno. Aspetta che arrivi per ricevere **auguri** e **regali**\n_Negli anni non bisestili il tuo compleanno sarà contato il 1 Marzo_`)
            else
                embed.setDescription(`${interaction.user.toString()} hai inserito correttamente la data del tuo compleanno. Aspetta che arrivi per ricevere **auguri** e **regali**`)

            if (moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1 == 1) {
                embed.addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, `Manca **${moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1} giorno** al tuo compleanno`)
            }
            else
                embed.addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, `Mancano **${moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1} giorni** al tuo compleanno`)

            interaction.message.edit({ embeds: [embed], components: [] })

            embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Birthday added :pencil:")
                .setColor(colors.green)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":calendar_spiral: Date", `${day} ${moment().set("month", month - 1).format("MMMM")}`)

            if (!isMaintenance())
                client.channels.cache.get(log.birthday.setBirthday).send({ embeds: [embed] })

            if (data.getHours() < 8) return

            if (userstats.birthday && ((userstats.birthday[0] == data.getMonth() + 1 && userstats.birthday[1] == data.getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && data.getMonth() == 2 && data.getDate() == 1))) {
                let canvas = await createCanvas(400, 400)
                let ctx = await canvas.getContext('2d')

                let img = await loadImage(illustrations.birthdayTodayBackground)
                ctx.drawImage(img, 0, 0)

                ctx.textBaseline = 'middle';
                ctx.font = "75px robotoBold"
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase()).width / 2, 105);

                ctx.font = "185px robotoBold"
                ctx.fillStyle = "#303030";
                ctx.fillText(data.getDate(), canvas.width / 2 - ctx.measureText(data.getDate()).width / 2, 247);

                img = await loadImage(illustrations.birthdayDecorations)
                ctx.drawImage(img, 0, 0)

                let randomItems = []
                items = items.filter(x => !x.priviled || (x.priviled && hasSufficientLevels(client, userstats, x.priviled)))
                for (let i = 1; i <= 4; i++) {
                    randomItems.push(items[Math.floor(Math.random() * items.length)])
                    items = items.filter(x => x != randomItems[randomItems.length - 1])
                }

                let embed = new Discord.MessageEmbed()
                    .setTitle(":tada: Happy birthday! :tada:")
                    .setColor("#FF1180")
                    .setThumbnail("attachment://canvas.png")
                    .setDescription("Tanti auguri di **buon compleanno**, goditi subito questi fantastici **regali**")
                    .addField(":gift: I tuoi regali", `
- +${(userstats.leveling.level || 1) * 40} XP
- +${(userstats.leveling.level || 1) * 10} Coins
- 4 oggetti random dallo **shop** ${randomItems.map(x => x.icon).join(" ")}
- **Boost x2** livellamento per tutto il giorno`)

                client.users.cache.get(userstats.id).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
                    .catch(() => { })

                userstats.leveling.xp += (userstats.leveling.level || 1) * 40
                userstats.economy.money += (userstats.leveling.level || 1) * 10
                randomItems.forEach(item => {
                    userstats.economy.inventory[item.id] = !userstats.economy.inventory[item.id] ? 1 : (userstats.economy.inventory[item.id] + 1)
                })

                userstats = await checkLevelUp(clientFun, userstats)

                updateUser(userstats)

                if (!isMaintenance()) {
                    client.channels.cache.get(log.birthday.birthdaysToday).messages.fetch({ limit: 1 })
                        .then(messages => {
                            for (let msg of Array.from(messages.values())) {
                                if (msg.embeds[0]?.fields[0]?.value == moment(data.getTime()).format("ddd DD MMM YYYY")) {
                                    let birthdayToday = []

                                    getAllUsers(client).forEach(userstats => {
                                        if (userstats.birthday && ((userstats.birthday[0] == data.getMonth() + 1 && userstats.birthday[1] == data.getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && data.getMonth() == 2 && data.getDate() == 1 && !isAnnoBisestile(new Date().getFullYear())))) {
                                            birthdayToday.push(userstats)
                                        }
                                    })

                                    let birthdaysList = ""
                                    let i = 0
                                    while (birthdayToday[i] && birthdaysList.length + `- ${client.users.cache.get(birthdayToday[i].id).toString()} - ID: ${birthdayToday[i].id}\n`.length < 900) {
                                        birthdaysList += `- ${client.users.cache.get(birthdayToday[i].id).toString()} - ID: ${birthdayToday[i].id}\n`
                                        i++
                                    }

                                    if (birthdayToday.length > i)
                                        birthdaysList += `Altri ${birthdayToday.length - i}...`


                                    let embed = new Discord.MessageEmbed()
                                        .setTitle(":gift: Birthdays today :gift:")
                                        .setColor(colors.purple)
                                        .addField(":alarm_clock: Day", `${moment(data.getTime()).format("ddd DD MMM YYYY")}`)
                                        .addField(":balloon: Birthdays", birthdaysList)

                                    msg.edit({ embeds: [embed] })
                                }
                                else {
                                    let embed = new Discord.MessageEmbed()
                                        .setTitle(":gift: Birthdays today :gift:")
                                        .setColor(colors.purple)
                                        .addField(":alarm_clock: Day", `${moment(data.getTime()).format("ddd DD MMM YYYY")}`)
                                        .addField(":balloon: Birthdays", `- ${interaction.user.toString()} - ID: ${interaction.user.id}`)

                                    client.channels.cache.get(log.birthday.birthdaysToday).send({ embeds: [embed] })
                                }
                            }
                        })
                }
            }
        }
    },
};
