const Discord = require("discord.js")
const Parser = require('expr-eval').Parser;
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { getServer } = require("../../functions/database/getServer")
const { updateServer } = require("../../functions/database/updateServer")
const { updateUser } = require("../../functions/database/updateUser")
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { checkBadwords } = require("../../functions/moderation/checkBadwords");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return

        if (message.channel.id != settings.idCanaliServer.countingplus) return
        if (message.author.bot) return

        let [trovata, nonCensurato, censurato] = checkBadwords(message.content);
        if (trovata && !getUserPermissionLevel(client, message.author.id) && !message.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        if (message.content == "cos" || message.content.startsWith("!")) return

        let numero
        try {
            numero = Parser.evaluate(message.content.replace(/\\/g, ""));
        }
        catch { return }

        let userstats = await getUser(message.author.id)
        if (!userstats) userstats = await addUser(message.member)

        let serverstats = await getServer()

        let operator = ["+", "+", "-", "-", "*"]

        let titleRandom = ["IMMAGINO AVRETE 5 IN MATEMATICA, GIUSTO?", "SAD FOR YOU", "PROPRIO ORA DOVEVI SBAGLIARE?", "MA SAPETE COME SI GIOCA?", "MA È COSÌ DIFFICILE QUESTO GIOCO?", "NOOOO, PERCHÈ...", "MEGLIO SE TORNATE A PROGRAMMARE", `MA SIETE SCEMI?`, "QUANTO HAI IN MATEMATICA?", `MA SIETE SICURI DI SAPER CONTARE ? `, "QUALCUNO QUI NON SA CONTARE", "SIETE DELLE CAPRE"]

        if (message.author.id == serverstats.countingplus.user) {
            serverstats.countingplus.user = null
            serverstats.countingplus.incorrect++
            serverstats.countingplus.operator = operator[Math.floor(Math.random() * operator.length)]
            serverstats.countingplus.number = Math.floor(Math.random() * (100 + 100 + 1)) - 100
            while (serverstats.countingplus.operator == "*" && serverstats.countingplus.number == 0) {
                serverstats.countingplus.number = Math.floor(Math.random() * (100 + 100 + 1)) - 100
            }
            serverstats.countingplus.gap = Math.floor(Math.random() * (10 - 1 + 1)) + 1

            updateServer(serverstats)

            let embed = new Discord.MessageEmbed()
                .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                .setColor(colors.red)
                .setDescription(`__Utente non valido!__\n${message.author.toString()} ogni utente può scrivere un solo numero alla volta
                
:point_right: Ora si ricomincia da \`${serverstats.countingplus.number}\` e ogni volta si ${serverstats.countingplus.operator == "+" ? "**aggiunge**" : serverstats.countingplus.operator == "-" ? "**sottrae**" : "**moltiplica** per"} \`${serverstats.countingplus.gap}\``)

            message.channel.send({ embeds: [embed] })

            message.channel.send(serverstats.countingplus.number.toString())
                .then(msg => {
                    msg.react("🟢")
                })

            userstats.countingplus.incorrect++
            userstats.countingplus.streak = 0
            updateUser(userstats)

            message.react("🔴")
        }
        else if (numero != eval(`${serverstats.countingplus.number}${serverstats.countingplus.operator}${serverstats.countingplus.gap}`)) {
            let embed = new Discord.MessageEmbed()
                .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                .setColor(colors.red)
                .setDescription(`__Numero errato!__\n${message.author.toString()} ha scritto \`${numero}\` ma il numero corretto era \`${eval(`${serverstats.countingplus.number}${serverstats.countingplus.operator}${serverstats.countingplus.gap}`)}\``)

            serverstats.countingplus.user = null
            serverstats.countingplus.incorrect++
            serverstats.countingplus.operator = operator[Math.floor(Math.random() * operator.length)]
            serverstats.countingplus.number = Math.floor(Math.random() * (100 + 100 + 1)) - 100
            while (serverstats.countingplus.operator == "*" && serverstats.countingplus.number == 0) {
                serverstats.countingplus.number = Math.floor(Math.random() * (100 + 100 + 1)) - 100
            }
            serverstats.countingplus.gap = Math.floor(Math.random() * (10 - 1 + 1)) + 1

            updateServer(serverstats)

            embed.description += `

:point_right: Ora si ricomincia da \`${serverstats.countingplus.number}\` e ogni volta si ${serverstats.countingplus.operator == "+" ? "**aggiunge**" : serverstats.countingplus.operator == "-" ? "**sottrae**" : "**moltiplica** per"} \`${serverstats.countingplus.gap}\``

            message.channel.send({ embeds: [embed] })

            message.channel.send(serverstats.countingplus.number.toString())
                .then(msg => {
                    msg.react("🟢")
                })

            userstats.countingplus.incorrect++
            userstats.countingplus.streak = 0

            updateUser(userstats)

            message.react("🔴")
        }
        else {
            serverstats.countingplus.number = numero
            serverstats.countingplus.lastScore = numero
            serverstats.countingplus.user = message.author.id
            serverstats.countingplus.lastUser = message.author.id
            serverstats.countingplus.timeLastScore = new Date().getTime()
            serverstats.countingplus.lastMessage = message.id
            serverstats.countingplus.correct++

            message.react("🟢")

            userstats.countingplus.lastScore = numero
            userstats.countingplus.timeLastScore = new Date().getTime()
            userstats.countingplus.correct++
            userstats.countingplus.streak++

            updateServer(serverstats)
            updateUser(userstats)
        }
    },
};