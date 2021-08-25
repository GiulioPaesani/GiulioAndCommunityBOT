const Discord = require("discord.js");
const Parser = require('expr-eval').Parser;

module.exports = {
    name: "messageDelete",
    execute(message) {
        if (message.channel.id != config.idCanaliServer.counting) return

        database.collection("serverstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var serverstats = result[0];

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

            message.channel.send(embed)

            message.channel.send(numero)
                .then(msg => {
                    msg.react("🟢");
                })
        })
    },
};