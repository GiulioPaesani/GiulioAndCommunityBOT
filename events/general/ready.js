module.exports = {
    name: `ready`,
    async execute() {
        const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        database = db.db("GiulioAndCommunity")

        await database.collection("serverstats").find().toArray(function (err, result) {
            serverstats = result[0];
        })

        await database.collection("userstats").find().toArray(function (err, result) {
            userstatsList = result
            console.log(`-- GiulioAndCommunity BOT è ONLINE! --`);


        })

        client.user.setActivity('!help', { type: 'WATCHING' });

        setInterval(checkModeration, 5 * 1000);

        setInterval(makeBackup, 1000);

        setInterval(updateServerstats, 60 * 1000)
        setInterval(updateUserstats, 60 * 1000)

        setInterval(youtubeNotification, 60 * 1000)

        setInterval(checkUnverifedUser, 1000)

        var embed = new Discord.MessageEmbed()
            .setTitle("Bot ONLINE")
            .setColor("#3ebd45")
            .addField(":alarm_clock: Time", "```" + moment(new Date().getTime()).format("ddd DD MMM, HH:mm:ss") + "```")

        client.channels.cache.get(log.ready).send(embed)
    },
};