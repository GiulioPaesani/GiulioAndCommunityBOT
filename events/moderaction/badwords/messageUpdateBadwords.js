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
    name: "messageUpdate",
    async execute(client, oldMessage, newMessage) {
        if (!newMessage.author) return

        const maintenanceStates = await isMaintenance(newMessage.author.id)
        if (maintenanceStates) return

        if (newMessage.author.bot) return
        if (newMessage.channel.type == "DM") return
        if (newMessage.guild.id != settings.idServer) return
        if (getUserPermissionLevel(client, newMessage.author.id) >= 1 || newMessage.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        [trovata, nonCensurato, censurato] = checkBadwords(newMessage.content);
        if (!trovata) return

        newMessage.delete()
            .catch(() => { })

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[BAD WORDS] ${newMessage.member.nickname || newMessage.author.username}`, iconURL: newMessage.member.displayAvatarURL({ dynamic: true }) })
            .setDescription("L'utilizzo di certe parole in questo server non è consentito")
            .setThumbnail(illustrations.badWords)
            .setColor(colors.purple)
            .addField(":envelope: Message edited", censurato.slice(0, 1024))
            .setFooter({ text: "User ID: " + newMessage.author.id })

        newMessage.channel.send({ embeds: [embed] })
            .then(async msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(newMessage.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${newMessage.author.toString()} - ${newMessage.author.tag}\nID: ${newMessage.author.id}`)
                    .addField(":anchor: Channel", `${newMessage.channel.toString()} - #${newMessage.channel.name}\nID: ${newMessage.channel.id}`)
                    .addField(":envelope: Message edited", nonCensurato.slice(0, 1024))

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor(colors.purple)
            .setThumbnail(illustrations.badWords)
            .addField(":envelope: Message edited", censurato.slice(0, 1024))
            .addField(":anchor: Channel", newMessage.channel.toString())

        newMessage.author.send({ embeds: [embed] })
            .catch(() => { })
    },
};