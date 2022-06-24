const Discord = require("discord.js")
const Parser = require('expr-eval').Parser;
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
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

        if (message.channel.id != settings.idCanaliServer.counting) return
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

        let titleRandom = ["IMMAGINO AVRETE 5 IN MATEMATICA, GIUSTO?", "SAD FOR YOU", "PROPRIO ORA DOVEVI SBAGLIARE?", "MA SAPETE COME SI GIOCA?", "MA È COSÌ DIFFICILE QUESTO GIOCO?", "NOOOO, PERCHÈ...", "MEGLIO SE TORNATE A PROGRAMMARE", `MA SIETE SCEMI ? `, "QUANTO HAI IN MATEMATICA?", `MA SIETE SICURI DI SAPER CONTARE ? `, "QUALCUNO QUI NON SA CONTARE", "SIETE DELLE CAPRE"]

        if (message.author.id == serverstats.counting.user) {
            serverstats.counting.user = null
            serverstats.counting.number = 0
            serverstats.counting.incorrect++

            updateServer(serverstats)

            let embed = new Discord.MessageEmbed()
                .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                .setColor(colors.red)
                .setDescription(`__Utente non valido!__\n${message.author.toString()} ogni utente può scrivere un solo numero alla volta
                
:point_right: Ora si ricomincia da \`0\``)

            message.channel.send({ embeds: [embed] })

            message.channel.send("0")
                .then(msg => {
                    msg.react("🟢")
                })

            userstats.counting.incorrect++
            userstats.counting.streak = 0
            updateUser(userstats)

            message.react("🔴")
        }
        else if (numero - 1 != serverstats.counting.number) {
            let embed = new Discord.MessageEmbed()
                .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                .setColor(colors.red)
                .setDescription(`__Numero errato!__\n${message.author.toString()} hai scritto \`${numero}\` ma il numero corretto era \`${serverstats.counting.number + 1}\`
                
:point_right: Ora si ricomincia da \`0\``)

            serverstats.counting.user = null
            serverstats.counting.number = 0
            serverstats.counting.incorrect++

            updateServer(serverstats)

            message.channel.send({ embeds: [embed] })

            message.channel.send("0")
                .then(msg => {
                    msg.react("🟢")
                })

            userstats.counting.incorrect++
            userstats.counting.streak = 0

            updateUser(userstats)

            message.react("🔴")
        }
        else {
            serverstats.counting.number = numero
            serverstats.counting.lastScore = numero
            serverstats.counting.user = message.author.id
            serverstats.counting.lastUser = message.author.id
            serverstats.counting.timeLastScore = new Date().getTime()
            serverstats.counting.lastMessage = message.id
            serverstats.counting.correct++

            if (numero > serverstats.counting.bestScore) {
                serverstats.counting.bestScore = numero
                serverstats.counting.timeBestScore = new Date().getTime()
                message.react("🔵")
            }
            else {
                message.react("🟢")
            }

            userstats.counting.lastScore = numero
            userstats.counting.timeLastScore = new Date().getTime()
            userstats.counting.correct++
            userstats.counting.streak++

            if (numero > userstats.counting.bestScore) {
                userstats.counting.bestScore = numero
                userstats.counting.timeBestScore = new Date().getTime()
            }

            updateServer(serverstats)
            updateUser(userstats)
        }
    },
};