module.exports = {
    name: "critica",
    aliases: ["critique"],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        let testo = args.join(" ");
        if (!testo) {
            var embed = new Discord.MessageEmbed().setTitle("Inserire un testo").setColor(`#ED1C24`).setDescription("`!critica [testo]`").setThumbnail('https://i.postimg.cc/zB4j8xVZ/Error.png');
            message.author.send(embed)
                .catch(() => { return })
            return
        }

        if (testo.lenght > 900) {
            var embed = new Discord.MessageEmbed().setTitle("Testo troppo lungo").setColor(`#ED1C24`).setDescription("Scrivi una critica più breve di 900 caratteri").setThumbnail('https://i.postimg.cc/zB4j8xVZ/Error.png');
            message.author.send(embed)
                .catch(() => { return })
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("👍 Nuova critica 💩")
            .setDescription("Grazie mille per aver lasciato una tua **critica costruttiva**")
            .addField("Critica", testo, false)

        message.author.send(embed)
            .catch(() => { return })

        var embed = new Discord.MessageEmbed()
            .setTitle("👍 Nuova critica 💩")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Author", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField("Critique", testo, false)

        client.channels.cache.get("922540867854684250").send(embed)
    },
};