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
        var contenuto = args.join(" ")

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

        message.channel.send({ embeds: [embed] })

        var embed = new Discord.MessageEmbed()
            .setTitle("💡 New suggestion 💡")
            .setColor("#fcba03")
            .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", `${message.author.username} (ID: ${message.author.id})`)
            .addField("Status", "Pending")
            .addField("Text", contenuto)

        var button1 = new Discord.MessageButton()
            .setStyle('DANGER')
            .setLabel('Rifiuta')
            .setCustomId(`rifiutaSuggestion`)
        var button2 = new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Approva')
            .setCustomId(`approvaSuggestion`)

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        var canale = client.channels.cache.find(channel => channel.id == log.community.suggestions);

        canale.send({ embeds: [embed], components: [row] })
    },
};