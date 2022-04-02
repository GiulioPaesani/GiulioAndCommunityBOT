module.exports = {
    name: "rank",
    aliases: ["level", "xp", "money", "coins", "balance"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare stastiche ranking di un utente",
    syntax: "!rank (user)",
    category: "ranking",
    channelsGranted: [settings.idCanaliServer.commands],
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
            return botCommandMessage(message, "Warning", "Non un bot", "Non puoi avere le statistiche di ranking di un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        var rankIcon = {
            "10": `<:10:${client.emojis.cache.find(emoji => emoji.name === "10").id}>`,
            "11": `<:11:${client.emojis.cache.find(emoji => emoji.name === "11").id}>`,
            "12": `<:12:${client.emojis.cache.find(emoji => emoji.name === "12").id}>`,
            "13": `<:13:${client.emojis.cache.find(emoji => emoji.name === "13").id}>`,
            "1Full": `<:1Full:${client.emojis.cache.find(emoji => emoji.name === "1Full").id}>`,
            "20": `<:20:${client.emojis.cache.find(emoji => emoji.name === "20").id}>`,
            "21": `<:21:${client.emojis.cache.find(emoji => emoji.name === "21").id}>`,
            "22": `<:22:${client.emojis.cache.find(emoji => emoji.name === "22").id}>`,
            "23": `<:23:${client.emojis.cache.find(emoji => emoji.name === "23").id}>`,
            "2Full": `<:2Full:${client.emojis.cache.find(emoji => emoji.name === "2Full").id}>`,
            "30": `<:30:${client.emojis.cache.find(emoji => emoji.name === "30").id}>`,
            "31": `<:31:${client.emojis.cache.find(emoji => emoji.name === "31").id}>`,
            "32": `<:32:${client.emojis.cache.find(emoji => emoji.name === "32").id}>`,
            "3Full": `<:3Full:${client.emojis.cache.find(emoji => emoji.name === "3Full").id}>`,
        }

        var xpProgress = ""
        var numEmoji = 8;
        var maxValue = getXpNecessari(userstats.level + 1) - getXpNecessari(userstats.level);
        var value = parseInt(userstats.xp - getXpNecessari(userstats.level));

        for (var i = 1; i <= numEmoji; i++) {
            if (i == 1) {
                if (value >= 1 * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3))
                    xpProgress += rankIcon["1Full"];
                else if (value >= parseInt(maxValue / numEmoji))
                    xpProgress += rankIcon["13"];
                else if (value >= parseInt(maxValue / numEmoji / 3 * 2))
                    xpProgress += rankIcon["12"];
                else if (value >= parseInt(maxValue / numEmoji / 3 * 1))
                    xpProgress += rankIcon["11"];
                else
                    xpProgress += rankIcon["10"];
            }
            else if (i == numEmoji) {
                if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji))
                    xpProgress += rankIcon["3Full"];
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 2))
                    xpProgress += rankIcon["32"];
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 1))
                    xpProgress += rankIcon["31"];
                else
                    xpProgress += rankIcon["30"];
            }
            else {
                if (value >= i * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3))
                    xpProgress += rankIcon["2Full"];
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji))
                    xpProgress += rankIcon["23"];
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 2))
                    xpProgress += rankIcon["22"];
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 1))
                    xpProgress += rankIcon["21"];
                else
                    xpProgress += rankIcon["20"];
            }
        }

        var leaderboardListXp = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.get(x.id)).sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))
        var positionXp = leaderboardListXp.findIndex(x => x.id == utente.id) + 1

        var leaderboardListEconomy = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.get(x.id)).sort((a, b) => (a.money < b.money) ? 1 : ((b.money < a.money) ? -1 : 0))
        var positionEconomy = leaderboardListEconomy.findIndex(x => x.id == utente.id) + 1

        const levelColor = require("../../config/levelColor.json")

        var embed = new Discord.MessageEmbed()
            .setTitle(`Ranking - ${utente.nickname ? utente.nickname : utente.username}`)
            .setColor(levelColor[userstats.level])
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .addField(`:beginner: Level ${userstats.level}`, `
${xpProgress}
XP ${humanize(userstats.xp - getXpNecessari(userstats.level))}/${humanize(getXpNecessari(userstats.level + 1) - getXpNecessari(userstats.level))} - Rank #${positionXp}`)
            .addField(`:coin: ${humanize(userstats.money)}$`, `${Object.keys(userstats.inventory).length == 0 ? "0" : Object.values(userstats.inventory).reduce((a, b) => a + b)} ${Object.keys(userstats.inventory).length == 0 ? "Items" : Object.values(userstats.inventory).reduce((a, b) => a + b) == 1 ? "Item" : "Items"} - Rank #${positionEconomy}`)

        message.channel.send({ embeds: [embed] })
    },
};