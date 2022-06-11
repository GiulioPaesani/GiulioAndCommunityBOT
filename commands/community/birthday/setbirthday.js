const Discord = require("discord.js");
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const illustrations = require("../../../config/general/illustrations.json")
const moment = require("moment")
const { createCanvas, loadImage } = require('canvas')
const { getUser } = require("../../../functions/database/getUser");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { addUser } = require("../../../functions/database/addUser");

module.exports = {
    name: "setbirthday",
    description: "Settare il proprio compleanno",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/setbirthday [month] [day]",
    category: "community",
    client: "general",
    data: {
        options: [
            {
                name: "month",
                description: "Mese del compleanno",
                type: "STRING",
                choices: [
                    {
                        name: "Gennaio",
                        value: "Gennaio"
                    },
                    {
                        name: "Febbraio",
                        value: "Febbraio"
                    },
                    {
                        name: "Marzo",
                        value: "Marzo",
                    },
                    {
                        name: "Aprile",
                        value: "Aprile"
                    },
                    {
                        name: "Maggio",
                        value: "Maggio"
                    },
                    {
                        name: "Giugno",
                        value: "Giugno"
                    },
                    {
                        name: "Luglio",
                        value: "Luglio"
                    },
                    {
                        name: "Agosto",
                        value: "Agosto"
                    },
                    {
                        name: "Settembre",
                        value: "Settembre"
                    },
                    {
                        name: "Ottobre",
                        value: "Ottobre"
                    },
                    {
                        name: "Novembre",
                        value: "Novembre"
                    },
                    {
                        name: "Dicembre",
                        value: "Dicembre"
                    }
                ],
                required: true
            },
            {
                name: "day",
                description: "Giorno del compleanno",
                type: "INTEGER",
                minValue: 1,
                maxValue: 31,
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let userstats = getUser(interaction.user.id)
        if (!userstats) userstats = addUser(interaction.member)[0]

        if (userstats.birthday && userstats.birthday[0]) {
            return replyMessage(client, interaction, "Warning", "Compleanno già inserito", "Hai già settato il tuo compleanno, non puoi più **modificarlo**", comando)
        }

        let month
        switch (interaction.options.getString("month")) {
            case "Gennaio": month = 1; break
            case "Febbraio": month = 2; break
            case "Marzo": month = 3; break
            case "Aprile": month = 4; break
            case "Maggio": month = 5; break
            case "Giugno": month = 6; break
            case "Luglio": month = 7; break
            case "Agosto": month = 8; break
            case "Settembre": month = 9; break
            case "Ottobre": month = 10; break
            case "Novembre": month = 11; break
            case "Dicembre": month = 12; break
        }

        let day = interaction.options.getInteger("day")

        if (!moment([2020, month - 1, day]).isValid() || (!moment([2020, month - 1, day]).isValid() && moment([2021, month - 1, day]).isValid())) {
            return replyMessage(client, interaction, "Error", "Inserire una data valida", "Scrivi la data valida del tuo compleanno", comando)
        }

        let canvas = await createCanvas(400, 400)
        let ctx = await canvas.getContext('2d')


        let img = await loadImage(illustrations.birthdayBackground)
        ctx.drawImage(img, 0, 0)

        ctx.textBaseline = 'middle';
        ctx.font = "75px robotoBold"
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(moment([2000, month - 1, day]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, month - 1, day]).format("MMM").toUpperCase()).width / 2, 105);

        ctx.font = "185px robotoBold"
        ctx.fillStyle = "#303030";
        ctx.fillText(day, canvas.width / 2 - ctx.measureText(day).width / 2, 247);

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi compleanno?")
            .setColor(colors.yellow)
            .setThumbnail("attachment://canvas.png")
            .setDescription("**Confermi** il complenno che hai inserito? Una volta inserito non potrai più modificarlo")
            .addField(`:balloon: ${day} ${moment().set("month", month - 1).format("MMMM")}`, "Se vuoi **rinserire** la data, riscrivi il comando `/setbirthday` altrimenti clicca su **\"Conferma compleanno\"** per inserire quella seleziona\n_Non potrai più modificare la data del tuo compleanno_")

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla inserimento")
            .setStyle("DANGER")
            .setCustomId(`annullaCompleanno,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma compleanno")
            .setStyle("SUCCESS")
            .setCustomId(`confermaCompleanno,${interaction.user.id},${month},${day}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')], components: [row] })
    },
};