module.exports = {
    name: "cserver",
    aliases: ["cserverstats", "cserverinfo", "clb", "cleaderboard"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands, config.idCanaliServer.counting],
    async execute(message, args, client) {

        var embed = new Discord.MessageEmbed()
            .setTitle("COUNTING - GiulioAndCommunity")
            .setThumbnail(message.member.guild.iconURL({ dynamic: true }))
            .setDescription("La classifica del server su **counting**")
            .addField(":1234: Current Number", "```" + serverstats.numero + "```", true)
            .addField(":medal: Last user", serverstats.ultimoUtente != "NessunUtente" ? (client.users.cache.find(u => u.id == serverstats.ultimoUtente) ? `\`\`\`${client.users.cache.find(u => u.id == serverstats.ultimoUtente)}\`\`\`` : "\`\`\`User undefined\`\`\`") : "```None```", true)

        var leaderboardBestScoreList = userstatsList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))

        var leaderboardBestScore = "";
        var utente;
        var i = 0, inseriti = 0;
        while (inseriti < 10) {
            if (!leaderboardBestScoreList[i]) inseriti = 10

            if (leaderboardBestScoreList[i]) {
                utente = client.users.cache.get(leaderboardBestScoreList[i].id);

                if (message.guild.members.cache.find(x => x.id == leaderboardBestScoreList[i].id)) {
                    switch (inseriti) {
                        case 0:
                            leaderboardBestScore += ":first_place: ";
                            break
                        case 1:
                            leaderboardBestScore += ":second_place: "
                            break
                        case 2:
                            leaderboardBestScore += ":third_place: "
                            break
                        default:
                            leaderboardBestScore += "**#" + (inseriti + 1) + "** "
                    }
                    leaderboardBestScore += utente.username + " - **" + leaderboardBestScoreList[i].bestScore + "**\r";
                    inseriti++;
                }
            }
            i++;
        }

        embed
            .addField(":trophy: Best score", "```" + serverstats.bestScore + " - " + leaderboardBestScoreList[0].username + " (" + moment(parseInt(serverstats.timeBestScore)).fromNow() + ")```", false)
            .addField("Leaderboard (by Best Score)", leaderboardBestScore, true)

        var leaderboardCorrectList = userstatsList.sort((a, b) => (a.correct < b.correct) ? 1 : ((b.correct < a.correct) ? -1 : 0))
        var leaderboardCorrect = "";
        var utente;
        var i = 0, inseriti = 0;
        while (inseriti < 10) {
            if (!leaderboardCorrectList[i]) inseriti = 10

            if (leaderboardCorrectList[i]) {
                utente = client.users.cache.get(leaderboardCorrectList[i].id);

                if (message.guild.members.cache.find(x => x.id == leaderboardCorrectList[i].id)) {
                    switch (inseriti) {
                        case 0:
                            leaderboardCorrect += ":first_place: ";
                            break
                        case 1:
                            leaderboardCorrect += ":second_place: "
                            break
                        case 2:
                            leaderboardCorrect += ":third_place: "
                            break
                        default:
                            leaderboardCorrect += "**#" + (inseriti + 1) + "** "
                    }
                    leaderboardCorrect += utente.username + " - **" + leaderboardCorrectList[i].correct + "**\r";
                    inseriti++;
                }
            }
            i++;
        }

        embed
            .addField("Leaderboard (by Correct)", leaderboardCorrect, true)

        message.channel.send(embed)
    },
};