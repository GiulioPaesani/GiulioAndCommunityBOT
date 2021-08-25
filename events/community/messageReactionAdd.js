const Discord = require("discord.js");

module.exports = {
    name: `messageReactionAdd`,
    async execute(messageReaction, user) {
        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        const { database, db } = await getDatabase()
        await database.collection("serverstats").find().toArray(async function (err, result) {
            let serverstats = result[0]
            let suggestions = serverstats.suggestions
            let challenges = serverstats.challenges

            if (messageReaction.message.channel.id == config.idCanaliServer.suggestions) {
                if (!suggestions.hasOwnProperty(messageReaction.message.id)) return

                if (messageReaction._emoji.name == "😍") {
                    if (!suggestions[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                        suggestions[messageReaction.message.id].totVotiPos.push(user.id)
                    }
                    else {
                        messageReaction.users.remove(user);
                    }
                }

                else if (messageReaction._emoji.name == "💩") {

                    if (!suggestions[messageReaction.message.id].totVotiPos.includes(user.id)) {
                        suggestions[messageReaction.message.id].totVotiNeg.push(user.id)
                    }
                    else {
                        messageReaction.users.remove(user);
                    }

                }
                var canale = client.channels.cache.get(config.idCanaliServer.suggestions)
                canale.messages.fetch(messageReaction.message.id)
                    .then(async message => {

                        var votiPos = suggestions[messageReaction.message.id].totVotiPos.length
                        var votiNeg = suggestions[messageReaction.message.id].totVotiNeg.length

                        var opinion = votiPos - votiNeg

                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle("💡Suggestions by " + client.users.cache.get(suggestions[messageReaction.message.id].user).username)
                            .setDescription(suggestions[messageReaction.message.id].suggerimento)
                            .setThumbnail(client.users.cache.get(suggestions[messageReaction.message.id].user).avatarURL({ dynamic: true }))
                            .setFooter("Suggestion ID: " + messageReaction.message.id)

                        if (votiPos == 0 && votiNeg == 0) {

                        }
                        else {
                            var upvotes = 100 * votiPos / (votiPos + votiNeg)
                            if (upvotes % 1 != 0) {
                                upvotes = upvotes.toFixed(2)

                            }
                            var downvotes = 100 * votiNeg / (votiPos + votiNeg)
                            if (downvotes % 1 != 0) {
                                downvotes = downvotes.toFixed(2)
                            }
                            newEmbed
                                .addField("🥇Votes", "Opinion: " + (opinion > 0 ? "+" + opinion : opinion) + "\rUpvotes: " + votiPos + " - " + upvotes + "%\rDownvotes: " + votiNeg + " - " + downvotes + "%")
                        }

                        message.edit(newEmbed)
                        serverstats.suggestions = suggestions;
                        await database.collection("serverstats").updateOne({}, { $set: serverstats });
                        await db.close()
                    })
            }
            if (messageReaction.message.channel.id == config.idCanaliServer.challenges) {
                if (!challenges.hasOwnProperty(messageReaction.message.id)) return

                if (messageReaction._emoji.name == "👍") {
                    if (!challenges[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                        challenges[messageReaction.message.id].totVotiPos.push(user.id)

                    }
                    else {
                        messageReaction.users.remove(user);
                    }

                }
                else if (messageReaction._emoji.name == "👎") {

                    if (!challenges[messageReaction.message.id].totVotiPos.includes(user.id)) {
                        challenges[messageReaction.message.id].totVotiNeg.push(user.id)

                    }
                    else {
                        messageReaction.users.remove(user);
                    }

                }

                var canale = client.channels.cache.get(config.idCanaliServer.challenges)
                await canale.messages.fetch(messageReaction.message.id)
                    .then(async message => {
                        var votiPos = challenges[messageReaction.message.id].totVotiPos.length
                        var votiNeg = challenges[messageReaction.message.id].totVotiNeg.length

                        var opinion = votiPos - votiNeg

                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle("🎯 Challenge by " + client.users.cache.get(challenges[messageReaction.message.id].user).username)
                            .setDescription(challenges[messageReaction.message.id].sfida)
                            .setThumbnail(client.users.cache.get(challenges[messageReaction.message.id].user).avatarURL({ dynamic: true }))
                            .setFooter("Challenge ID: " + messageReaction.message.id)

                        if (votiPos == 0 && votiNeg == 0) {

                        }
                        else {
                            var upvotes = 100 * votiPos / (votiPos + votiNeg)
                            if (upvotes % 1 != 0) {
                                upvotes = upvotes.toFixed(2)

                            }
                            var downvotes = 100 * votiNeg / (votiPos + votiNeg)
                            if (downvotes % 1 != 0) {
                                downvotes = downvotes.toFixed(2)
                            }
                            newEmbed
                                .addField("🥇Votes", "Opinion: " + (opinion > 0 ? "+" + opinion : opinion) + "\rUpvotes: " + votiPos + " - " + upvotes + "%\rDownvotes: " + votiNeg + " - " + downvotes + "%")
                        }

                        message.edit(newEmbed)
                        serverstats.challenges = challenges;
                        await database.collection("serverstats").updateOne({}, { $set: serverstats });
                        await db.close()
                    })
            }
        })
    },
};