const Discord = require("discord.js");
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const moment = require("moment")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { getAllUsers } = require("../../../functions/database/getAllUsers");
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "birthdayslist",
    description: "Visualizzare tutti i compleanni degli utenti",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/birthdayslist (month) (day)",
    category: "community",
    client: "general",
    data: {
        options: [
            {
                name: "month",
                description: "Mese nel quale vedere i compleanni",
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
                required: false
            },
            {
                name: "day",
                description: "Giorno nel quale vedere i compleanni",
                type: "INTEGER",
                minValue: 1,
                maxValue: 31,
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":gift: Birthday list")
            .setColor(colors.red)

        let month;
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

        if ((!month && !day) || (!month && day)) {
            month = new Date().getMonth() + 1
            day = new Date().getDate()
        }

        if (day) {
            if (!moment([2020, month - 1, day]).isValid() || (!moment([2020, month - 1, day]).isValid() && moment([2021, month - 1, day]).isValid())) {
                return replyMessage(client, interaction, "Error", "Inserire una data valida", "Scrivi una data valida in cui vedere i compleanni", comando)
            }

            let birthdayList = ""

            let userstatsList = getAllUsers(client).filter(x => x.birthday[0] && x.birthday[0] == month && x.birthday[1] == day)

            let i = 0
            while (userstatsList[i] && birthdayList.length + `${client.users.cache.get(userstatsList[i].id).toString()}\n`.length <= 900) {
                birthdayList += `${client.users.cache.get(userstatsList[i].id).toString()}\n`
                i++
            }

            if (userstatsList.length > i) {
                birthdayList += `Altri ${userstatsList.length - i}.. `
            }

            if (birthdayList && month == 2 && day == 29)
                birthdayList = `_:warning: Per gli anni non bisestili, i compleanni verranno festeggiati il **1 Marzo**_\n${birthdayList}`

            embed
                .setDescription(`Lista di compleanni in questo giorno
                
**${day} ${moment().set("month", month - 1).format("MMMM")}**
${birthdayList || "_Nessun compleanno_"}`)

            let button1 = new Discord.MessageButton()
                .setLabel(moment([2020, month - 1, day]).subtract(1, 'days').format("D MMMM"))
                .setCustomId(`birthdayListIndietro,${month},${day},${interaction.user.id}`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            let button2 = new Discord.MessageButton()
                .setLabel(moment([2020, month - 1, day]).add(1, 'days').format("D MMMM"))
                .setCustomId(`birthdayListAvanti,${month},${day},${interaction.user.id}`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: [row] })
        }
        else {
            let birthdayList = ""

            let userstatsList = getAllUsers(client).filter(x => x.birthday[0])

            let firstDay = moment([2020, month - 1, 1])
            let lastDay = moment([2020, month - 1, new Date(2020, month, 0).getDate()])

            let dayAttuale = firstDay.subtract(1, "days")
            let i = 0
            while (dayAttuale.date() != lastDay.date() || dayAttuale.month() != lastDay.month()) {
                dayAttuale = dayAttuale.add(1, "days")
                i++
                birthdayList += `${getEmoji(client, `${userstatsList.find(x => x.birthday[0] == dayAttuale.month() + 1 && x.birthday[1] == dayAttuale.date()) ? "BirthdaysDay" : "Day"}${dayAttuale.date()}`)}${i == 7 ? "\n" : ""}`
                if (i == 7) i = 0
            }

            embed
                .setDescription(`Lista di compleanni in questo mese
                
**${moment().set("month", month - 1).format("MMMM")}**
${birthdayList}`)

            let button1 = new Discord.MessageButton()
                .setLabel(moment().set("month", month - 1).subtract(1, "month").format("MMMM"))
                .setCustomId(`birthdayListIndietro,${month},,${interaction.user.id}`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            let button2 = new Discord.MessageButton()
                .setLabel(moment().set("month", month - 1).add(1, "month").format("MMMM"))
                .setCustomId(`birthdayListAvanti,${month},,${interaction.user.id}`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: [row] })
        }
    },
};