module.exports = {
    name: "avatar",
    aliases: ["av"],
    description: "Visuallizzare l'immagine profilo di un utente",
    syntax: "!avatar (user)",
    category: "statistics",
    onlyStaff: false,
    availableOnDM: true,
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var utente = message.author;
        }
        else {
            var utente = message.mentions.users?.first()
            if (!utente) {
                var utente = await getUser(args.join(" "))
            }
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setTitle("Avatar - " + (utente.nickname ? utente.nickname : utente.username))
            .setDescription(`L'avatar di questo utente
Other formats: **[.gif](${utente.displayAvatarURL({ dynamic: true, size: 1024, format: `gif` })})** | **[.jpeg](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `jpeg` })})** | **[.webp](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `webp` })})** | **[.png](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `png` })})**`)
            .setImage(utente.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 1024
            }))

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};