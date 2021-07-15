const Discord = require("discord.js");
const { parseZone } = require("moment");

module.exports = {
    name: "db",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    execute(message, args, client) {
        database.collection("userstats").find().toArray(async function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            //!Aggiungere al db
            // message.guild.members.cache.forEach(async element => {
            //     if (!element.user.bot) {
            //         if (!userstatsList.find(x => x.id == element.id)) {
            //             var userstats = {
            //                 id: element.id,
            //                 username: element.user.username,
            //                 roles: [],
            //                 statistics: {
            //                     "totalMessage": 0,
            //                     "commands": 0,
            //                     "addReaction": 0,
            //                     "deleteMessage": 0,
            //                     "editMessage": 0
            //                 },
            //                 lastScore: 0,
            //                 bestScore: 0,
            //                 timeLastScore: null,
            //                 timeBestScore: null,
            //                 correct: 0,
            //                 incorrect: 0,
            //                 level: 0,
            //                 xp: 0,
            //                 cooldownXp: 0,
            //                 warn: [],
            //                 moderation: {
            //                     "type": "",
            //                     "since": "",
            //                     "until": "",
            //                     "reason": "",
            //                     "moderator": ""
            //                 }
            //             }
            //             await database.collection("userstats").insertOne(userstats)
            //                 .then(() => {
            //                     console.log(`----> ${userstats.username} aggiunto <----------------------------------------------`)
            //                 })
            //         }
            //         else {
            //             console.log(`${element.user.username} c'era gia`)
            //         }
            //     }
            // })

            //!leveling
            // const leveling = require("./leveling.json")
            // console.log(leveling)
            // message.guild.members.cache.forEach(async element => {
            //     if (!element.user.bot) {
            //         if (userstatsList.find(x => x.id == element.id)) {
            //             const userLevel = leveling.find(y => y.id == element.id)
            //             if (userLevel) {
            //                 await database.collection("userstats").updateOne({ id: element.id }, { $set: { level: parseInt(userLevel.level), xp: parseInt(userLevel.xp) } });
            //                 console.log(`${userLevel.username} aggiunto`)
            //             }
            //         }
            //     }
            // })

            //!counting
            // const fun = require("./fun.json")
            // console.log(fun)
            // message.guild.members.cache.forEach(async element => {
            //     if (!element.user.bot) {
            //         if (userstatsList.find(x => x.id == element.id)) {
            //             const userFun = fun.find(y => y.id == element.id)
            //             if (userFun) {
            //                 await database.collection("userstats").updateOne({ id: element.id }, { $set: { lastScore: parseInt(userFun.lastScore), bestScore: parseInt(userFun.bestScore), timeLastScore: userFun.timeLastScore, timeBestScore: userFun.timeBestScore, correct: parseInt(userFun.correct), incorrect: parseInt(userFun.incorrect) } });
            //                 console.log(`${userFun.username} aggiunto`)
            //             }
            //         }
            //     }
            // })
        })
    },
};