module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        var leaderboardList = userstatsList.sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))
        var leaderboard = "";
        var utente;
        var i = 0, inseriti = 0;
        while (inseriti < 10) {
            if (!leaderboardList[i]) inseriti = 10

            if (leaderboardList[i]) {
                utente = client.users.cache.get(leaderboardList[i].id);

                if (message.guild.members.cache.find(x => x.id == leaderboardList[i].id)) {
                    switch (inseriti) {
                        case 0:
                            leaderboard += ":first_place: ";
                            break
                        case 1:
                            leaderboard += ":second_place: "
                            break
                        case 2:
                            leaderboard += ":third_place: "
                            break
                        default:
                            leaderboard += "**#" + (inseriti + 1) + "** "
                    }
                    leaderboard += utente.username + " - **Level " + leaderboardList[i].level + "** (XP: " + humanNumber(parseInt(leaderboardList[i].xp)) + ")\r";
                    inseriti++;
                }
            }
            i++;
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("GiulioAndCommunity")
            .setDescription("Leaderboard dei livelli di tutti gli utenti nel server")
            .setThumbnail(message.member.guild.iconURL({ dynamic: true }))
            .addField("Leaderboard", leaderboard)

        message.channel.send(embed)
    },
};