module.exports = {
    name: "cuser",
    aliases: ["cuserstats", "cuserinfo"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands, config.idCanaliServer.counting],
    async execute(message, args, client) {
        if (!args[0]) {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first()
            if (!utente) {
                var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
            }
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!userinfo [user]`")
            return
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return
        if (!userstats.timeLastScore) {
            warning(message, "Non ha mai giocato", "Questo utente non ha mai giocato a Counting")
            return
        }

        var leaderboard = userstatsList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
        var position = leaderboard.findIndex(x => x.id == utente.user.id) + 1

        var embed = new Discord.MessageEmbed()
            .setTitle("COUNTING - " + utente.user.tag)
            .setDescription("Tutte le statistiche di **counting** su questo utente")
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
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

        message.channel.send(embed)
    },
};