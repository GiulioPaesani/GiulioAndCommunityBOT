module.exports = {
    name: `messageReactionRemove`,
    async execute(messageReaction, user) {
        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (messageReaction.message.channel.id == config.idCanaliServer.suggestions) {
            try {
                var userUp = (await messageReaction.message.reactions.cache.find(x => x._emoji.name == "😍").users.fetch()).map(user => user.id)
                var userDown = (await messageReaction.message.reactions.cache.find(x => x._emoji.name == "💩").users.fetch()).map(user => user.id)

                if (!userUp) return
                if (!userDown) return

                userUp = userUp.filter(x => x != config.idBot)
                userDown = userDown.filter(x => x != config.idBot)

                var embed = new Discord.MessageEmbed()
                    .setTitle(messageReaction.message.embeds[0].title)
                    .setDescription(messageReaction.message.embeds[0].description)
                    .setThumbnail(messageReaction.message.embeds[0].thumbnail.url)

                if (userUp.length != 0 || userDown.length != 0) {
                    var upvotes = 100 * userUp.length / (userUp.length + userDown.length)
                    if (upvotes % 1 != 0) {
                        upvotes = upvotes.toFixed(2)

                    }
                    var downvotes = 100 * userDown.length / (userUp.length + userDown.length)
                    if (downvotes % 1 != 0) {
                        downvotes = downvotes.toFixed(2)
                    }
                }
                else {
                    var upvotes = 0;
                    var downvotes = 0;
                }

                embed.addField(":first_place: Votes", `
Opinion: **${(userUp.length - userDown.length) > 0 ? "+" : ""}${userUp.length - userDown.length}**
Upvotes: **${userUp.length}** - ${upvotes}%
Downvotes: **${userDown.length}** - ${downvotes}%
`)

                messageReaction.message.edit(embed)
            }
            catch {

            }
        }

        if (messageReaction.message.channel.id == config.idCanaliServer.challenges) {
            try {
                var userUp = (await messageReaction.message.reactions.cache.find(x => x._emoji.name == "👍").users.fetch()).map(user => user.id)
                var userDown = (await messageReaction.message.reactions.cache.find(x => x._emoji.name == "👎").users.fetch()).map(user => user.id)

                if (!userUp) return
                if (!userDown) return

                userUp = userUp.filter(x => x != config.idBot)
                userDown = userDown.filter(x => x != config.idBot)

                var embed = new Discord.MessageEmbed()
                    .setTitle(messageReaction.message.embeds[0].title)
                    .setDescription(messageReaction.message.embeds[0].description)
                    .setThumbnail(messageReaction.message.embeds[0].thumbnail.url)

                if (userUp.length != 0 || userDown.length != 0) {
                    var upvotes = 100 * userUp.length / (userUp.length + userDown.length)
                    if (upvotes % 1 != 0) {
                        upvotes = upvotes.toFixed(2)

                    }
                    var downvotes = 100 * userDown.length / (userUp.length + userDown.length)
                    if (downvotes % 1 != 0) {
                        downvotes = downvotes.toFixed(2)
                    }
                }
                else {
                    var upvotes = 0;
                    var downvotes = 0;
                }

                embed.addField(":first_place: Votes", `
Opinion: **${(userUp.length - userDown.length) > 0 ? "+" : ""}${userUp.length - userDown.length}**
Upvotes: **${userUp.length}** - ${upvotes}%
Downvotes: **${userDown.length}** - ${downvotes}%
`)

                messageReaction.message.edit(embed)
            }
            catch {

            }
        }
    },
};