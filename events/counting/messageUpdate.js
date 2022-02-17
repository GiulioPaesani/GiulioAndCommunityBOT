module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {
        if (!oldMessage) return
        if (!oldMessage.author) return

        if (isMaintenance(oldMessage.author.id)) return

        if (oldMessage.channel.id != settings.idCanaliServer.counting) return
        if (oldMessage.content == "") return

        try {
            var numero = Parser.evaluate(oldMessage.content);
        }
        catch { return }

        try {
            var numero2 = Parser.evaluate(newMessage.content);
            if (numero == numero2) return
        }
        catch { }

        if (numero < serverstats.numero) {
            return
        }

        if (numero != serverstats.numero) { //Se giocato lo stesso utente piu volte
            return
        }

        newMessage.reactions.removeAll();

        var titleRandom = ["PENSAVI DI FREGARMI EH!", "CREDI DI FREGARMI?", "TE LO MODIFICHI E IO LO RISCRIVO...", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
        var embed = new Discord.MessageEmbed()
            .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
            .setDescription(oldMessage.author.toString() + " ha modificato il numero `" + numero + "`")
            .setColor("#148eff");

        oldMessage.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":pencil: Number edited :pencil:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Member", `${newMessage.author.toString()} - ID: ${newMessage.author.id}`, false)
                    .addField("Message", `
Old: ${oldMessage.content}
New: ${newMessage.content}`, false)

                if (!isMaintenance())
                    client.channels.cache.get(log.counting.editDeleteNumbers).send({ embeds: [embed] })
            })

        oldMessage.channel.send(numero.toString())
            .then(msg => {
                msg.react("🟢");
            })
    },
};