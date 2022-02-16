module.exports = {
    name: "regalaxp",
    aliases: ["giftxp"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Regalare punti esperienza a un utente",
    syntax: "!regalaxp [user] [xp]",
    category: "ranking",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "), args.slice(0, -1).join(" "))
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (message.author.id == utente.id) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi regalarti xp da solo")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi regalare xp a un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!args[args.length - 1]) {
            return botCommandMessage(message, "Error", "Inserire un numero di xp", "Scrivi il numero di punti esperienza che vuoi regalare all'utente", property)
        }

        var xp = await parseInt(args[args.length - 1]);
        if (!xp) {
            return botCommandMessage(message, "Error", "Numero di xp non valido", "Hai inserito un numero di punti esperienza non valido", property)
        }

        if (xp < 0) {
            return botCommandMessage(message, "Error", "Numero di xp non valido", "Hai inserito un numero di punti esperienza non valido", property)
        }

        var userstats2 = userstatsList.find(x => x.id == message.author.id);
        if (!userstats2) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (userstats2.xp < xp) {
            return botCommandMessage(message, "Warning", "Non hai abbastanza xp", "Non hai xp a sufficienza per regalarne a un utente")
        }

        userstats = await addXp(userstats, xp, 0);
        userstats2 = await addXp(userstats2, xp * -1, 0, true);

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        userstatsList[userstatsList.findIndex(x => x.id == userstats2.id)] = userstats2

        var embed = new Discord.MessageEmbed()
            .setTitle("Regalo inviato")
            .setThumbnail("https://i.postimg.cc/B6XsJXDC/giftxp.png")
            .setColor("#FF3E75")
            .setDescription(`Hai regalato con successo \`${xp} xp\` a ${utente.toString()}`)

        message.channel.send({ embeds: [embed] })

        var embed = new Discord.MessageEmbed()
            .setTitle("Un piccolo regalo per te")
            .setThumbnail("https://i.postimg.cc/B6XsJXDC/giftxp.png")
            .setColor("#FF3E75")
            .setDescription(`${message.author.toString()} ti ha regalato \`${xp} xp\`\rGoditi questi nuovi punti esperienza`)

        utente.send({ embeds: [embed] })
            .catch(() => { })
    },
};
