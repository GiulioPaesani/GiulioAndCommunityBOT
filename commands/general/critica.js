module.exports = {
    name: "critica",
    aliases: ["critique"],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        let testo = args.join(" ");
        if (!testo) {
            error(message, "Inserire un testo", "`!critica [testo]`")
            return
        }

        if (testo.lenght > 900) {
            error(message, "Testo troppo lungo", "Scrivi una critica più breve di 900 caratteri")
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("👍 Nuova critica 💩")
            .setDescription("Grazie mille per aver lasciato una tua **critica costruttiva**")
            .addField("Critica", testo, false)

        message.channel.send(embed)

        var embed = new Discord.MessageEmbed()
            .setTitle("👍 Nuova critica 💩")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Author", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField("Critique", testo, false)

        client.channels.cache.get("922540867854684250").send(embed)
    },
};