const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getUser } = require("../../../functions/database/getUser")
const { addUser } = require("../../../functions/database/addUser")
const { updateUser } = require("../../../functions/database/updateUser")
const { createCanvas, loadImage } = require('canvas')
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("confermaCompleanno")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

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
                embed.setDescription(`${interaction.user.toString()} hai inserito correttamente la data del tuo compleanno. Aspetta che arrivi per ricevere gli **auguri** dalla community\n_Negli anni non bisestili il tuo compleanno sarà contato il 1 Marzo_`)
            else
                embed.setDescription(`${interaction.user.toString()} hai inserito correttamente la data del tuo compleanno. Aspetta che arrivi per ricevere gli **auguri** dalla community`)

            if (moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1 == 1) {
                embed.addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, `Manca **${moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1} giorno** al tuo compleanno`)
            }
            else
                embed.addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, `Mancano **${moment([moment([data.getFullYear(), month - 1, day]).diff(moment()) < 0 ? data.getFullYear() + 1 : data.getFullYear(), month - 1, day]).diff(moment(), "days") + 1} giorni** al tuo compleanno`)

            interaction.message.edit({ embeds: [embed], components: [] })

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

                let embed = new Discord.MessageEmbed()
                    .setTitle(":tada: Happy birthday! :tada:")
                    .setColor("#FF1180")
                    .setThumbnail("attachment://canvas.png")
                    .setDescription("Tanti auguri di **buon compleanno**")

                client.users.cache.get(userstats.id).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
                    .catch(() => { })
            }
        }
    },
};
