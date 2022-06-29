const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")
const { checkBadwords } = require("../../../functions/moderation/checkBadwords")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (getUserPermissionLevel(client, message.author.id) >= 1 || message.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        let [trovata, nonCensurato, censurato] = checkBadwords(message.content);
        if (!trovata) return

        message.delete()
            .catch(() => { })

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[BAD WORDS] ${message.member.nickname || message.author.username}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
            .setDescription("L'utilizzo di certe parole in questo server non è consentito")
            .setThumbnail(illustrations.badWords)
            .setColor(colors.purple)
            .addField(":envelope: Message", censurato.slice(0, 1024))
            .setFooter({ text: "User ID: " + message.author.id })

        message.channel.send({ embeds: [embed] })
            .then(async msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(message.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ${message.author.tag}\nID: ${message.author.id}`)
                    .addField(":anchor: Channel", `${message.channel.toString()} - #${message.channel.name}\nID: ${message.channel.id}`)
                    .addField(":envelope: Message", nonCensurato.slice(0, 1024))

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor(colors.purple)
            .setThumbnail(illustrations.badWords)
            .addField(":envelope: Message", censurato.slice(0, 1024))
            .addField(":anchor: Channel", message.channel.toString())

        message.author.send({ embeds: [embed] })
            .catch(() => { })
    },
};