const Discord = require("discord.js");

module.exports = {
    name: "challenge",
    aliases: ["sfida"],
    onlyStaff: false,
    channelsGranted: ["869975184289988698"],
    async execute(message, args, client) {
        database = await getDatabase()
        await database.collection("serverstats").find().toArray(function (err, result) {
            let serverstats = result[0]
            let challenges = serverstats.challenges;

            let contenuto = args.join(" ");
            if (!contenuto) {
                error(message, "Inserire una challenge", "`!challenge [sfida]`")
                return
            }

            if (contenuto.length > 500) {
                error(message, "Troppo lungo", "Inserire una sfida più corta di 500 caratteri")
                return
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("🎯 Challenge by " + message.member.user.username)
                .setDescription(contenuto)
                .setThumbnail(message.member.user.avatarURL({ dynamic: true }))

            var canale = client.channels.cache.find(channel => channel.id == config.idCanaliServer.challenges);

            canale.send(embed)
                .then(msg => {
                    msg.react("👍")
                    msg.react("👎")

                    embed
                        .setFooter("Challenge ID: " + msg.id)

                    msg.edit(embed)

                    challenges[msg.id] = {
                        sfida: contenuto,
                        user: message.member.user.id,
                        messageId: msg.id,
                        totVotiPos: [],
                        totVotiNeg: []
                    }

                    serverstats.challenges = challenges;
                    database.collection("serverstats").updateOne({}, { $set: serverstats });

                    message.delete();
                })
        })
        await database.close()
    },
};