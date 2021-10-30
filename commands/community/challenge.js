module.exports = {
    name: "challenge",
    aliases: ["sfida"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let contenuto = args.join(" ")

        if (!contenuto) {
            error(message, "Inserire una challenge", "`!challenge [sfida]`")
            return
        }

        if (contenuto.length > 500) {
            error(message, "Troppo lungo", "Inserire una sfida più corta di 500 caratteri")
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("🎯 New challenge 🎯")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription("Attendi che lo staff approvi la tua sfida```" + contenuto + "```")

        message.channel.send(embed)

        var embed = new Discord.MessageEmbed()
            .setTitle("🎯 New challenge 🎯")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", "```" + `${message.author.username} (ID: ${message.author.id})` + "```")
            .addField(":beginner: Status", "```Pending```")
            .addField(":bookmark_tabs: Text", "```" + contenuto + "```")

        var button1 = new disbut.MessageButton()
            .setStyle('red')
            .setLabel('Rifiuta')
            .setID(`rifiutaChallenge`)
        var button2 = new disbut.MessageButton()
            .setStyle('green')
            .setLabel('Approva')
            .setID(`approvaChallenge`)

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        let canale = client.channels.cache.find(channel => channel.id == log.challenges);

        canale.send(embed, row)
    },
};