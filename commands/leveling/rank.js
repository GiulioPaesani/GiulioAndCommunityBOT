module.exports = {
    name: "rank",
    aliases: ["level", "xp"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
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
            error(message, "Utente non trovato", "`!rank [user]`")
            return
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return

        let progress = "";
        let nProgress = parseInt(7 * (userstats.xp - calcoloXpNecessario(userstats.level)) / (calcoloXpNecessario(userstats.level + 1) - calcoloXpNecessario(userstats.level)))

        for (let i = 0; i < nProgress; i++) {
            progress += ":white_medium_small_square:";
        }
        for (let i = 0; i < 7 - nProgress; i++) {
            progress += ":white_small_square:";
        }

        let leaderboardList = userstatsList.sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))
        let position = leaderboardList.findIndex(x => x.id == utente.user.id) + 1

        const levelColor = require("../../config/levelColor.json")

        let embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setColor(levelColor[userstats.level])
            .setDescription("Informazioni sul livellamento di questo utente")
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
            .addField("Level " + userstats.level, progress + "\rXP: " + humanNumber(parseInt(userstats.xp - calcoloXpNecessario(userstats.level))) + "/" + humanNumber(calcoloXpNecessario(userstats.level + 1) - calcoloXpNecessario(userstats.level)) + " - Rank: #" + position)

        message.channel.send(embed)
    },
};