module.exports = {
    name: `messageDelete`,
    async execute(message) {
        if (isMaintenance()) return

        if (message.guild?.id != settings.idServer) return

        if (!message) return
        if (!message.author) return
        if (message.author.bot) return

        if (message.content.startsWith(prefix)) return;

        var embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Message deleted :wastebasket:")
            .setColor("#e31705")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField(":ledger: Channel", `#${message.channel.name}`)

        if (message.mentions.roles) {
            message.mentions.roles.forEach(role => {
                message.content = message.content.replace(`<@&${role.id}>`, `<@&${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == role.name).id}>`)
            })
        }

        embed
            .addField("Content", message.content ? (message.content.length > 500 ? `${message.content.slice(0, 497)}...` : message.content) : "_Null_")

        var textEmbed = ""
        if (message.embeds[0]) {
            if (message.embeds[0].title)
                textEmbed += `Title: ${message.embeds[0].title}\r`
            if (message.embeds[0].description)
                textEmbed += `Description: ${message.embeds[0].description}\r`
            if (message.embeds[0].fields[0]) {
                textEmbed += `Fields:\r`
                message.embeds[0].fields.forEach(field => {
                    textEmbed += `${field.name} - ${field.value.replace(/\`/g, "\\`")}\r`
                })
            }
            if (message.embeds[0].footer)
                textEmbed += `Footer: ${message.embeds[0].footer}\r`
        }

        embed
            .addField("Embed", textEmbed ? textEmbed : "_Null_")

        var attachments = "";
        message.attachments.forEach(attachment => {
            attachments += `[File link](${attachment.url}), `
        })
        if (attachments)
            attachments = attachments.slice(0, -2);

        embed
            .addField("Attachments", attachments ? attachments : "_Null_")

        client.channels.cache.get(log.server.messages).send({ embeds: [embed] })
    },
};