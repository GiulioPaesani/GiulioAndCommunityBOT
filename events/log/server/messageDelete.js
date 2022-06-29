const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `messageDelete`,
    async execute(client, message) {
        const maintenanceStates = await isMaintenance()
        if (maintenanceStates) return

        if (message.guild?.id != settings.idServer) return

        if (!message) return
        if (!message.author) return
        if (message.author.bot) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Message deleted :wastebasket:")
            .setColor(colors.red)
            .setThumbnail(message.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ${message.author.tag}\nID: ${message.author.id}`)
            .addField(":anchor: Channel", `${message.channel.toString()} - #${message.channel.name}\nID: ${message.channel.id}`)

        if (message.mentions.roles) {
            message.mentions.roles.forEach(role => {
                message.content = message.content.replace(`<@&${role.id}>`, `@${role.name}`)
            })
        }

        if (message.content)
            embed.addField(":page_facing_up: Content", message.content ? (message.content.length > 1024 ? `${message.content.slice(0, 1021)}...` : message.content) : "_Null_")

        if (message.attachments.size > 0)
            embed.addField(":paperclip: Attachments", message.attachments.map(x => `[${x.name}](${x.url})`).join(", "))

        if (message.stickers.size > 0)
            embed.addField(":label: Stickers", message.stickers.map(x => `[${x.name}](${x.url})`).join(", "))

        client.channels.cache.get(log.server.messages).send({ embeds: [embed] })
    },
};