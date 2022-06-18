const Discord = require("discord.js");
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const illustrations = require("../../../config/general/illustrations.json")
const { createCanvas, loadImage } = require('canvas')
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { replyMessage } = require("../../../functions/general/replyMessage")
const { isAnnoBisestile } = require("../../../functions/community/birthday/isAnnoBisestile")
const { prossimoBirthday } = require("../../../functions/community/birthday/prossimoBirthday")
const { getTaggedUser } = require("../../../functions/general/getTaggedUser")

module.exports = {
    name: "birthday",
    description: "Visualizzare il compleanno di un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/birthday (user)",
    category: "community",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere il compleanno",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi visualizzare il compleanno di un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let embed = new Discord.MessageEmbed()
            .setTitle(`Birthday - ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`)

        if (!userstats.birthday || !userstats.birthday[0]) {
            embed
                .setColor(colors.gray)
                .setThumbnail(illustrations.birthdayNotSetted)

            if (utente.id == interaction.user.id) {
                embed
                    .addField(`:grey_exclamation: Not setted`, `_Non hai ancora inserito il tuo compleanno_\nSe setterai il giorno del tuo compleanno, riceverai **auguri** e tanti **regali** personalizzati. Fallo subito con il comando \`/setbirthday [month] [day]\``)
            }
            else {
                embed
                    .addField(`:grey_exclamation: Not setted`, `_Questo utente non ha ancora inserito il suo compleanno_`)
            }

            interaction.reply({ embeds: [embed] })
        }
        else {
            let canvas
            if ((new Date().getMonth() == userstats.birthday[0] - 1 && new Date().getDate() == userstats.birthday[1]) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && new Date().getMonth() == 2 && new Date.getMonth() == 1 && !isAnnoBisestile(new Date().getFullYear()))) {
                canvas = await createCanvas(400, 400)
                let ctx = await canvas.getContext('2d')

                let img = await loadImage(illustrations.birthdayTodayBackground)
                ctx.drawImage(img, 0, 0)

                ctx.textBaseline = 'middle';
                ctx.font = "75px robotoBold"
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase()).width / 2, 105);

                ctx.font = "185px robotoBold"
                ctx.fillStyle = "#303030";
                ctx.fillText(userstats.birthday[1], canvas.width / 2 - ctx.measureText(userstats.birthday[1]).width / 2, 247);

                img = await loadImage(illustrations.birthdayDecorations)
                ctx.drawImage(img, 0, 0)

                embed
                    .setColor("#FF1180")
                    .setThumbnail("attachment://canvas.png")
                    .addField(`:gift: ${userstats.birthday[1]} ${moment().set("month", userstats.birthday[0] - 1).format("MMMM")}`, `**Oggi** è il compleanno di ${utente.toString()}\nFategli gli auguri e tanti regali`)
            }
            else {
                canvas = await createCanvas(400, 400)
                let ctx = await canvas.getContext('2d')

                let img = await loadImage(illustrations.birthdayBackground)
                ctx.drawImage(img, 0, 0)

                ctx.textBaseline = 'middle';
                ctx.font = "75px robotoBold"
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, userstats.birthday[0] - 1, userstats.birthday[1]]).format("MMM").toUpperCase()).width / 2, 105);

                ctx.font = "185px robotoBold"
                ctx.fillStyle = "#303030";
                ctx.fillText(userstats.birthday[1], canvas.width / 2 - ctx.measureText(userstats.birthday[1]).width / 2, 247);

                embed
                    .setColor(colors.red)
                    .setThumbnail("attachment://canvas.png")

                if (moment(prossimoBirthday(userstats.birthday[0], userstats.birthday[1])).diff(moment(), "days") + 1 == 1) {
                    embed.addField(`:balloon: ${userstats.birthday[1]} ${moment().set("month", userstats.birthday[0] - 1).format("MMMM")}`, `Manca **${moment(prossimoBirthday(userstats.birthday[0], userstats.birthday[1])).diff(moment(), "days") + 1} giorno** al compleanno di ${utente.toString()}`)
                }
                else
                    embed.addField(`:balloon: ${userstats.birthday[1]} ${moment().set("month", userstats.birthday[0] - 1).format("MMMM")}`, `Mancano **${moment(prossimoBirthday(userstats.birthday[0], userstats.birthday[1])).diff(moment(), "days") + 1} giorni** al compleanno di ${utente.toString()}`)
            }

            interaction.reply({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
        }
    },
};