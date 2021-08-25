const Discord = require("discord.js");
const moment = require("moment")

module.exports = {
    name: "clearinfractions",
    aliases: ["clearwarn", "clearinfraction", "clearinfrazioni"],
    onlyStaff: true,
    channelsGranted: [],
    execute(message, args, client) {
        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var utente = message.mentions.members.first()
            if (!utente) {
                var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args[0])
            }

            if (!utente) {
                error(message, "Utente non trovato", "`!clearinfractions [user] (code warn)`")
                return
            }

            try {
                var code = parseInt(args[args.length - 1]);
            } catch {
                error(message, "Codice non valido", "Inserire un codice di un infrazione valido")
                return
            }

            var userstats = userstatsList.find(x => x.id == utente.id);
            if (!userstats) return

            if (userstats.warn.length == 0) {
                warming(message, "Utente senza infrazioni", "Questo utente non ha nessuna infrazione")
                return
            }
            else {

                if (!code) {
                    correct(message, "Infrazioni eliminate", `Sono state eliminate **${userstats.warn.length} infrazioni** da ${utente.toString()}`)
                    userstats.warn = [];
                }
                else {
                    if (!userstats.warn.hasOwnProperty(code - 1)) {
                        error(message, "Infrazione non trovata", "`!clearinfractions [user] (code warn)`")
                        return
                    }

                    correct(message, "Infrazione eliminata", `Infrazione eliminata\r\`\`\`#${code} - ${userstats.warn[code - 1].reason} (${moment(userstats.warn[code - 1].time).fromNow()})\`\`\``)

                    delete userstats.warn.splice(code - 1, 1)

                }

                database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
            }

        })
    },
};
