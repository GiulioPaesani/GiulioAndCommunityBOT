module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type != "dm") return

        var embed = new Discord.MessageEmbed()
            .setTitle(":inbox_tray: DM Message :inbox_tray:")
            .setColor("#74AD53")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", "```" + `${message.author.username} (ID: ${message.author.id})` + "```")
            .addField(":alarm_clock: Time", "```" + moment(new Date().getTime()).format("ddd DD MMM, HH:mm") + "```")
            .addField(":keyboard: Content", "```" + (message.content ? message.content.slice(0, 900) : "None") + "```")

        var attachment = message.attachments.array()[0]
        if (attachment) {
            embed
                .addField(":paperclip: Attachment", "```" + attachment.name + "```[File here](" + attachment.url + ")")
        }

        client.channels.cache.get(log.dm).send(embed)
    },
};