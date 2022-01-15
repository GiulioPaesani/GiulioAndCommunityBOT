module.exports = {
    name: "suggest",
    aliases: ["suggestion", "suggerimento"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Fare un suggerimento per il bot, server o canale",
    syntax: "!suggest [suggerimento]",
    category: "community",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        let contenuto = args.join(" ")

        if (!contenuto) {
            return botCommandMessage(message, "Error", "Inserire un suggerimento", "Scrivi il testo della tua suggestion", property)
        }

        if (contenuto.length > 500) {
            return botCommandMessage(message, "Error", "Suggerimento troppo lungo", "Scrivi una suggestion non più lunga di 500 caratteri", property)
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("💡 New suggestion 💡")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription("Attendi che lo staff approvi il tuo suggerimento")
            .addField(":bookmark_tabs: Suggestion", contenuto)

        message.channel.send(embed)

        var embed = new Discord.MessageEmbed()
            .setTitle("💡 New suggestion 💡")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", `${message.author.username} (ID: ${message.author.id})`)
            .addField("Status", "Pending")
            .addField("Text", contenuto)

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

        let canale = client.channels.cache.find(channel => channel.id == log.community.suggestions);

        canale.send(embed, row)
    },
};