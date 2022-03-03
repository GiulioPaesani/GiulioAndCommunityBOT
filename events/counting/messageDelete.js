module.exports = {
    name: "messageDelete",
    async execute(message) {
        if (!message.author) return

        if (isMaintenance(message.author.id)) return

        if (message.channel.id != settings.idCanaliServer.counting) return

        try {
            var numero = Parser.evaluate(message.content);
        }
        catch { return }

        if (numero < serverstats.numero) {
            return
        }

        if (numero != serverstats.numero) { //Se giocato lo stesso utente piu volte
            return
        }

        var titleRandom = ["PENSAVI DI FREGARMI EH!", "TE LO ELIMINI E IO LO RISCRIVO...", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
        var embed = new Discord.MessageEmbed()
            .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
            .setDescription(message.author.toString() + " ha eliminato il numero `" + numero + "`")
            .setColor("#148eff");

        message.channel.send({ embeds: [embed] })

        message.channel.send(numero.toString())
            .then(msg => {
                msg.react("🟢");
            })

        var embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Number deleted :wastebasket:")
            .setColor("#ababab")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField("Number", numero.toString(), false)

        if (!isMaintenance())
            client.channels.cache.get(log.counting.editDeleteNumbers).send({ embeds: [embed] })
    },
};
