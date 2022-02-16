module.exports = {
    name: "cuser",
    aliases: ["cuserstats", "cu"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare statistiche counting di un utente",
    syntax: "!cuser (user)",
    category: "fun",
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.counting],
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

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Statistiche bot non disponibili", "Un bot non ha nessuna statistica Counting")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats || !userstats.timeLastScore) {
            return botCommandMessage(message, "Warning", "Non ha mai giocato", "Questo utente non ha mai giocato a Counting")
        }

        var leaderboard = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.find(y => y.id == x.id)).sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
        var position = leaderboard.findIndex(x => x.id == utente.id) + 1

        var embed = new Discord.MessageEmbed()
            .setTitle("Counting - " + (utente.nickname ? utente.nickname : utente.username))
            .setDescription("Tutte le statistiche di **counting** su questo utente")
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .addField(":trophy: Best score", "```" + userstats.bestScore + " (" + moment(new Date(parseInt(userstats.timeBestScore))).fromNow() + ")```", true)
            .addField(":chart_with_upwards_trend: Rank", "```#" + position + "/" + Object.keys(leaderboard).length + "```", true)
            .addField(":medal: Last score", "```" + userstats.lastScore + " (" + moment(new Date(parseInt(userstats.timeLastScore))).fromNow() + ")```", true)
        if ((100 * userstats.correct / (userstats.correct + userstats.incorrect)) == 0)
            embed.addField(":white_check_mark: Total correct", "```" + userstats.correct + "```", true)
        else
            embed.addField(":white_check_mark: Total correct", "```" + userstats.correct + " (" + (100 * userstats.correct / (userstats.correct + userstats.incorrect)).toFixed(2) + "%)```", true)

        if ((100 * userstats.incorrect / (userstats.correct + userstats.incorrect)) == 0)
            embed.addField(":x: Total incorrect", "```" + userstats.incorrect + "```", true)
        else
            embed.addField(":x: Total incorrect", "```" + userstats.incorrect + " (" + (100 * userstats.incorrect / (userstats.correct + userstats.incorrect)).toFixed(2) + "%)```", true)

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};