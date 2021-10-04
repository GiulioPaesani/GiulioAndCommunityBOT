var MongoClient = require('mongodb').MongoClient;
const Discord = require("discord.js");
const moment = require("moment")

const YoutubePoster = require("discord-youtube");

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

        // const options = {
        //     loop_delays_in_min: 1, //don't go under 0!
        //     defaults: {
        //         Notification: "<@{discorduser}> Posted: **{videotitle}**, as \`{videoauthorname}\`\n{videourl}"
        //     },
        // };
        // client.YTP = new YoutubePoster(client, options)

        //         await client.YTP.setChannel("https://www.youtube.com/channel/UCK6QwAdGWOWN9AT1_UQFGtA", client.channels.cache.get("869975176895418438"), client.users.cache.get("793768313934577664"), `-------------:computer: **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** :computer:-------------
        // Ehy ragazzi, è appena uscito un nuovo video su **GiulioAndCode**
        // Andate subito a vedere "**{videotitle}**"

        // {videourl}
        // <@&857544584691318814>`, preventDuplicates = true).then(() => console.log("Notifiche GiulioAndCode attivate!"))

        //         await client.YTP.setChannel("https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA", client.channels.cache.get("869975176895418438"), client.users.cache.get("793768313934577664"), `-------------:v: **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** :v:-------------
        // Ehy ragazzi, è appena uscito un nuovo video su **Giulio**
        // Andate subito a vedere "**{videotitle}**"

        // {videourl}
        // <@&883062518774370345>`, preventDuplicates = true).then(() => console.log("Notifiche Giulio attivate!"))

        //         await client.YTP.setChannel("https://www.youtube.com/channel/UCkbF1Vs7k5qgtuO74cV3Feg", client.channels.cache.get("869975198483488890"), client.users.cache.get("793768313934577664"), `-------------:v: **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** :v:-------------
        // Ehy ragazzi, è appena uscito un nuovo video su **TESTING**
        // Andate subito a vedere "**{videotitle}**"

        // {videourl}`, preventDuplicates = true).then(() => console.log("Notifiche TESTUBG attivate!"))


        var embed = new Discord.MessageEmbed()
            .setTitle("Bot ONLINE")
            .setColor("#3ebd45")
            .addField(":alarm_clock: Time", "```" + moment(new Date().getTime()).format("ddd DD MMM, HH:mm:ss") + "```")

        client.channels.cache.get(log.ready).send(embed)
    },
};
