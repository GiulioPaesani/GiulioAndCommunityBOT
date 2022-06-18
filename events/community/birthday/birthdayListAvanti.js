const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { getEmoji } = require("../../../functions/general/getEmoji")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("birthdayListAvanti")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[3] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(":gift: Birthday list")
            .setColor(colors.red)

        let month = parseInt(interaction.customId.split(",")[1])
        let day = parseInt(interaction.customId.split(",")[2])

        if (day) {
            month = moment([2020, parseInt(interaction.customId.split(",")[1]) - 1, parseInt(interaction.customId.split(",")[2])]).add(1, 'days').month() + 1
            day = moment([2020, parseInt(interaction.customId.split(",")[1]) - 1, parseInt(interaction.customId.split(",")[2])]).add(1, 'days').date()

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

            interaction.message.edit({ embeds: [embed], components: [row] })
        }
        else {
            month = moment([2020, parseInt(interaction.customId.split(",")[1]) - 1]).add(1, "month").month() + 1

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

            interaction.message.edit({ embeds: [embed], components: [row] })
        }
    },
};
