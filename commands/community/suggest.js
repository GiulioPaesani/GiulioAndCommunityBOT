const Discord = require("discord.js");

module.exports = {
    name: "suggest",
    aliases: ["suggerisci", "suggerimento"],
    onlyStaff: false,
    channelsGranted: ["793781902728495104"],
    execute(message, args, client) {
        database.collection("serverstats").find().toArray(function (err, result) {
            let serverstats = result[0]
            let suggestions = serverstats.suggestions;

            let contenuto = args.join(" ")

            if (!contenuto) {
                error(message, "Inserire un suggerimento", "`!suggest [suggerimento]`")
                return
            }

            if (contenuto.length > 500) {
                error(message, "Troppo lungo", "Inserire un suggerimento più corto di 500 caratteri")
                return
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("💡Suggestions by " + message.member.user.username)
                .setDescription(contenuto)
                .setThumbnail(message.member.user.avatarURL({ dynamic: true }))

            let canale = client.channels.cache.find(channel => channel.id == config.idCanaliServer.suggestions);

            canale.send(embed)
                .then(msg => {
                    msg.react("😍")
                    msg.react("💩")

                    embed
                        .setFooter("Suggestion ID: " + msg.id)

                    msg.edit(embed)

                    suggestions[msg.id] = {
                        suggerimento: contenuto,
                        user: message.member.user.id,
                        messageId: msg.id,
                        totVotiPos: [],
                        totVotiNeg: []
                    }

                    serverstats.suggestions = suggestions;
                    database.collection("serverstats").updateOne({}, { $set: serverstats });

                    message.delete();
                })
        })
    },
};