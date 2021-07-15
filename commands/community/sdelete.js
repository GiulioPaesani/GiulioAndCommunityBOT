const Discord = require("discord.js");

module.exports = {
    name: "sdelete",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    execute(message, args, client) {
        database.collection("serverstats").find().toArray(function (err, result) {
            let serverstats = result[0]
            let suggestions = serverstats.suggestions;

            let id = args[0];
            if (!id) {
                error(message, "Inserire un id", "`!sdelete [id]`")
                return
            }

            if (!suggestions[id]) {
                error(message, "Suggerimento non trovato", "`!sdelete [id]`")
                return
            }

            let canale = client.channels.cache.get(config.idCanaliServer.suggestions)
            canale.messages.fetch(id)
                .then(message => {
                    message.delete()
                })

            let embed = new Discord.MessageEmbed()
                .setTitle("Suggerimento eliminato")
                .setThumbnail(`https://i.postimg.cc/SRpBjMg8/Giulio.png`)
                .setColor(`#16A0F4`)
                .setDescription("Questo suggerimento è stato eliminato dalla lista")
                .addField(":bulb: Suggestion", "```" + suggestions[id].suggerimento + "```")
                .addField(":placard: ID", "```" + id + "```")

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 10000 }).catch()
                msg.delete({ timeout: 10000 }).catch()
            })

            delete suggestions[id];
            serverstats.suggestions = suggestions;
            database.collection("serverstats").updateOne({}, { $set: serverstats });
        })
    },
};