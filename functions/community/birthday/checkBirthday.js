const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const items = require("../../../config/ranking/items.json")
const illustrations = require("../../../config/general/illustrations.json")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { createCanvas, loadImage } = require('canvas')
const { updateUser } = require("../../database/updateUser")
const { hasSufficientLevels } = require("../../leveling/hasSufficientLevels")
const { checkLevelUp } = require("../../../functions/leveling/checkLevelUp")

const checkBirthday = async (client) => {
    let data = new Date()

    if (data.getMinutes() != 0) return
    if (data.getSeconds() != 0) return
    if (data.getHours() != 0 && data.getHours() != 8) return

    let birthdayToday = []

    let userstatsList = await getAllUsers(client)
    userstatsList.forEach(userstats => {
        if (userstats.birthday && ((userstats.birthday[0] == data.getMonth() + 1 && userstats.birthday[1] == data.getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && data.getMonth() == 2 && data.getDate() == 1 && !isAnnoBisestile(new Date().getFullYear())))) {
            birthdayToday.push(userstats)
        }
    })

    if (birthdayToday.length > 0) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
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

            birthdayToday.forEach(async userstats => {
                if (client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == userstats.id)) {
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

                    userstats = await checkLevelUp(client, userstats)

                    updateUser(userstats)
                }
            })
        }

        if (data.getHours() == 8 && data.getMinutes() == 0 && data.getSeconds() == 0) {
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

            let embed = new Discord.MessageEmbed()
                .setTitle(":tada: Happy birthday! :tada:")
                .setColor("#FF1180")
                .setThumbnail("attachment://canvas.png")

            if (birthdayToday.length == 1) {
                embed
                    .setDescription(`Oggi è il compleanno di ${client.guilds.cache.get(settings.idServer).members.cache.get(birthdayToday[0].id).nickname || client.guilds.cache.get(settings.idServer).members.cache.get(birthdayToday[0].id).user.username}\nFategli tanti **auguri** e tanti **regali**`)
            }
            else {
                let textUsers = ""
                for (let i = 0; i < birthdayToday.length - 1; i++)
                    textUsers += `${client.guilds.cache.get(settings.idServer).members.cache.get(birthdayToday[0].id).nickname || client.guilds.cache.get(settings.idServer).members.cache.get(birthdayToday[0].id).user.username}, `

                if (textUsers != "") textUsers = textUsers.slice(0, -2)

                textUsers += ` e ${client.guilds.cache.get(settings.idServer).members.cache.get(birthdayToday[0].id).nickname || client.guilds.cache.get(settings.idServer).members.cache.get(birthdayToday[0].id).user.username}`

                embed
                    .setDescription(`Oggi è il compleanno di ${textUsers}\nFate a tutti tanti **auguri** e tanti **regali**`)
            }

            client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
        }

    }
}

module.exports = { checkBirthday }