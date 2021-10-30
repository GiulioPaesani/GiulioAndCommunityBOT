module.exports = {
    name: "messageUpdate",
    async execute(oldMessage) {
        if (oldMessage.channel.id != config.idCanaliServer.counting) return
        if (oldMessage.content == "") return

        try {
            var numero = Parser.evaluate(oldMessage.content);
        }
        catch { return }

        if (numero < serverstats.numero) {
            return
        }

        if (numero != serverstats.numero) { //Se giocato lo stesso utente piu volte
            return
        }

        oldMessage.reactions.removeAll();

        var titleRandom = ["PENSAVI DI FREGARMI EH!", "CREDI DI FREGARMI?", "TE LO MODIFICHI E IO LO RISCRIVO...", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
        var embed = new Discord.MessageEmbed()
            .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
            .setDescription(oldMessage.author.toString() + " ha modificato il numero `" + numero + "`")
            .setColor("#148eff");

        oldMessage.channel.send(embed)

        oldMessage.channel.send(numero)
            .then(msg => {
                msg.react("🟢");
            })
    },
};