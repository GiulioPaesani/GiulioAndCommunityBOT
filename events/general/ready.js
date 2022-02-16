module.exports = {
    name: `ready`,
    async execute() {
        const db = await MongoClient.connect(`mongodb+srv://giulioandcode:${process.env.passworddb}@clustergiulioandcommuni.xqwnr.mongodb.net/test`, { useNewUrlParser: true, useUnifiedTopology: true })
        database = db.db("GiulioAndCommunity")

        await database.collection("serverstats").find().toArray(function (err, result) {
            serverstats = result[0];
            console.log("► SERVERSTATS ottenuto")
        })

        await database.collection("userstats").find().toArray(function (err, result) {
            userstatsList = result
            console.log("► USERSTATS ottenuto")
        })

        console.log(`-- GiulioAndCommunity BOT è ONLINE! --`);

        var embed = new Discord.MessageEmbed()
            .setTitle("Bot ONLINE - " + (process.env.isHeroku == "true" ? "Heroku" : "Local"))
            .setColor("#3ebd45")
            .addField(":alarm_clock: Time", moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss"))

        if (process.env.maintenance == "1") {
            console.log(`Maintenance State 1 - Only Tester`)
            embed.addField("Maintenance", "State 1 - Only Tester")
        }
        else if (process.env.maintenance == "2") {
            console.log(`Maintenance State 2 - Nobody`)
            embed.addField("Maintenance", "State 2 - Nobody")
        }
        else if (process.env.maintenance == "3") {
            console.log(`Maintenance State 3 - Except Tester`)
            embed.addField("Maintenance", "State 3 - Except Tester")
        }
        else {
            console.log(`Maintenance OFF`)
            embed.addField("Maintenance", "State OFF")
        }

        client.channels.cache.get(log.general.ready).send({ embeds: [embed] })

        client.user.setActivity('!help', { type: 'WATCHING' });

        if (!isMaintenance()) {
            setInterval(checkModeration, 5 * 1000);

            setInterval(checkActivityPrivateRooms, 30 * 1000)

            setInterval(makeBackup, 1000);

            setInterval(updateUserstats, 60 * 1000)
            setInterval(updateServerstats, 60 * 1000)

            // setInterval(deleteDBLeavedUsers, 10 * 1000)

            setInterval(youtubeNotification, 60 * 1000)

            setInterval(checkUnverifedUser, 1000)

            setInterval(statsVocal, 1000)

            setInterval(checkBirthday, 1000)

            setInterval(checkRoomInDB, 1000 * 60 * 5)
            setInterval(checkTicketInDB, 1000 * 60 * 5)
        }

        const firstInvites = await client.guilds.cache.get(settings.idServer).invites.fetch()
        invites.set(settings.idServer, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
    },
};