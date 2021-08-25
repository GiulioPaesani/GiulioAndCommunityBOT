const Discord = require("discord.js");

module.exports = {
    name: "cdelete",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        const { database, db } = await getDatabase()
        await database.collection("serverstats").find().toArray(function (err, result) {
            let serverstats = result[0]
            let challenges = serverstats.challenges;

            let id = args[0];
            if (!id) {
                error(message, "Inserire un id", "`!csdelete [id]`")
                return
            }

            if (!challenges[id]) {
                error(message, "Challenge non trovata", "`!cdelete [id]`")
                return
            }

            let canale = client.channels.cache.get(config.idCanaliServer.challenges)
            canale.messages.fetch(id)
                .then(message => {
                    message.delete()
                })

            let embed = new Discord.MessageEmbed()
                .setTitle("Challenge eliminata")
                .setThumbnail(`https://i.postimg.cc/SRpBjMg8/Giulio.png`)
                .setColor(`#16A0F4`)
                .setDescription("Questa sfida è stata eliminata dalla lista")
                .addField("🎯 Challenges", "```" + challenges[id].sfida + "```")
                .addField(":placard: ID", "```" + id + "```")

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 10000 }).catch()
                msg.delete({ timeout: 10000 }).catch()
            })

            delete challenges[id];
            serverstats.challenges = challenges;
            database.collection("serverstats").updateOne({}, { $set: serverstats });
            await db.close()
        })
    },
};