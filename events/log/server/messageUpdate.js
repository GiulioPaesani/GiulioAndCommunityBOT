const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `messageUpdate`,
    client: "general",
    async execute(client, oldMessage, newMessage) {
        if (isMaintenance()) return

        if (newMessage.guild?.id != settings.idServer) return

        if (newMessage.author?.bot) return
        if (!newMessage.author) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Message updated :pencil:")
            .setDescription(`[Message link](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
            .setColor(colors.yellow)
            .setThumbnail(newMessage.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${newMessage.author.toString()} - ${newMessage.author.tag}\nID: ${newMessage.author.id}`)
            .addField(":anchor: Channel", `${newMessage.channel.toString()} - #${newMessage.channel.name}\nID: ${newMessage.channel.id}`)

        if (oldMessage.mentions.roles) {
            oldMessage.mentions.roles.forEach(role => {
                oldMessage.content = oldMessage.content.replace(`<@&${role.id}>`, `@${role.name}`)
            })
        }
        if (newMessage.mentions.roles) {
            newMessage.mentions.roles.forEach(role => {
                newMessage.content = newMessage.content.replace(`<@&${role.id}>`, `@${role.name}`)
            })
        }

        if (oldMessage.content != newMessage.content)
            embed.addField(":page_facing_up: Content", `
Old: ${oldMessage.content ? (oldMessage.content.length > 1024 ? `${oldMessage.content.slice(0, 1021)}...` : oldMessage.content) : "_Null_"}
New: ${newMessage.content ? (newMessage.content.length > 1024 ? `${newMessage.content.slice(0, 1021)}...` : newMessage.content) : "_Null_"}
`)

        if (JSON.stringify(oldMessage.attachments) != JSON.stringify(newMessage.attachments))
            embed.addField(":paperclip: Attachments", `
Old: ${oldMessage.attachments.size > 0 ? oldMessage.attachments.map(x => `[${x.name}](${x.url})`).join(", ") : "_Null_"}
New: ${newMessage.attachments.size > 0 ? newMessage.attachments.map(x => `[${x.name}](${x.url})`).join(", ") : "_Null_"}
`)

        if (JSON.stringify(oldMessage.stickers) != JSON.stringify(newMessage.stickers))
            embed.addField(":label: Stickers", `
Old: ${oldMessage.stickers.size > 0 ? oldMessage.stickers.map(x => `[${x.name}](${x.url})`).join(", ") : "_Null_"}
New: ${newMessage.stickers.size > 0 ? newMessage.stickers.map(x => `[${x.name}](${x.url})`).join(", ") : "_Null_"}
`)

        client.channels.cache.get(log.server.messages).send({ embeds: [embed] })
    },
};