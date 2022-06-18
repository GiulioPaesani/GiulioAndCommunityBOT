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
        if (message.type == "CHANNEL_PINNED_MESSAGE" && message.channel.id == settings.idCanaliServer.onewordstory) message.delete()

        if (isMaintenance(message.author.id)) return

        if (message.channel.id != settings.idCanaliServer.onewordstory) return
        if (message.author.bot) return

        let [trovata, nonCensurato, censurato] = checkBadwords(message.content);
        if (trovata && !getUserPermissionLevel(client, message.author.id) && !message.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        let userstats = getUser(message.author.id)
        if (!userstats) userstats = addUser(message.member)[0]

        let serverstats = getServer()

        if (!message.content) message.delete()

        if (message.content.split(" ")[1]) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Solo una parola")
                .setColor(colors.red)
                .setDescription(`In **one word story** puoi comporre una storia con gli altri utenti scrivendo solo una parola alla volta, e non una frase`)

            message.author.send({ embeds: [embed] })
                .catch(() => { })

            message.delete()
        }
        else if (serverstats.onewordstory.words[serverstats.onewordstory.words.length - 1]?.user == message.author.id) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Un parola a turno")
                .setColor(colors.red)
                .setDescription(`In **one word story** non puoi scrivere più parole di seguito, ma solo dopo un altro utente`)

            message.author.send({ embeds: [embed] })
                .catch(() => { })

            message.delete()
        }
        else {
            serverstats.onewordstory.lastMessage = message.id
            serverstats.onewordstory.totWords++
            serverstats.onewordstory.totWordsToday++
            serverstats.onewordstory.words.push({
                word: message.content,
                message: message.id,
                user: message.author.id,
                time: new Date().getTime()
            })

            userstats.onewordstory.totWords++
            userstats.onewordstory.totWordsToday++

            updateServer(serverstats)
            updateUser(userstats)
        }
    },
};