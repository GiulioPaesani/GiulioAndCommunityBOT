module.exports = {
    name: "suggest",
    aliases: ["suggerisci", "suggerimento"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let contenuto = args.join(" ")

        if (!contenuto) {
            error(message, "Inserire un suggerimento", "`!suggest [suggerimento]`")
            return
        }

        if (contenuto.length > 500) {
            error(message, "Troppo lungo", "Inserire un suggerimento più corto di 500 caratteri")
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("💡 New suggestion 💡")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription("Attendi che lo staff approvi il tuo suggerimento```" + contenuto + "```")

        message.channel.send(embed)

        var embed = new Discord.MessageEmbed()
            .setTitle("💡 New suggestion 💡")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", "```" + `${message.author.username} (ID: ${message.author.id})` + "```")
            .addField(":beginner: Status", "```Pending```")
            .addField(":bookmark_tabs: Text", "```" + contenuto + "```")

        var button1 = new disbut.MessageButton()
            .setStyle('red')
            .setLabel('Rifiuta')
            .setID(`rifiutaSuggestion`)
        var button2 = new disbut.MessageButton()
            .setStyle('green')
            .setLabel('Approva')
            .setID(`approvaSuggestion`)

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        let canale = client.channels.cache.find(channel => channel.id == log.suggestions);

        canale.send(embed, row)
    },
};