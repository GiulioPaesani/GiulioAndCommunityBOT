module.exports = {
    name: `messageUpdate`,
    async execute(oldMessage, newMessage) {
        if (isMaintenance()) return

        if (newMessage.guild?.id != settings.idServer) return

        if (newMessage.author?.bot) return
        if (!newMessage.author) return

        if (oldMessage.content == newMessage.content && JSON.stringify(oldMessage.attachments) == JSON.stringify(newMessage.attachments)) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Message updated :pencil:")
            .setDescription(`[Message link](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
            .setColor("#fcba03")
            .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${newMessage.author.toString()} - ID: ${newMessage.author.id}`, false)
            .addField(":ledger: Channel", `#${newMessage.channel.name}`)

        if (oldMessage.mentions.roles) {
            oldMessage.mentions.roles.forEach(role => {
                oldMessage.content = oldMessage.content.replace(`<@&${role.id}>`, `<@&${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == role.name).id}>`)
            })
        }
        if (newMessage.mentions.roles) {
            newMessage.mentions.roles.forEach(role => {
                newMessage.content = newMessage.content.replace(`<@&${role.id}>`, `<@&${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == role.name).id}>`)
            })
        }

        embed
            .addField("Content", `
Old: ${oldMessage.content ? (oldMessage.content.length > 500 ? `${oldMessage.content.slice(0, 497)}...` : oldMessage.content) : "_Null_"}
New: ${newMessage.content ? (newMessage.content.length > 500 ? `${newMessage.content.slice(0, 497)}...` : newMessage.content) : "_Null_"}
`)

        var oldAttachments = "", newAttachments = "";
        oldMessage.attachments.forEach(attachment => {
            oldAttachments += `[File link](${attachment.url}), `
        })
        if (oldAttachments)
            oldAttachments = oldAttachments.slice(0, -2);

        newMessage.attachments.forEach(attachment => {
            newAttachments += `[File link](${attachment.url}), `
        })
        if (newAttachments)
            newAttachments = newAttachments.slice(0, -2);

        embed
            .addField("Attachments", `
Old: ${oldAttachments ? oldAttachments : "_Null_"}
New: ${newAttachments ? newAttachments : "_Null_"}
`)

        client.channels.cache.get(log.server.messages).send({ embeds: [embed] })
    },
};