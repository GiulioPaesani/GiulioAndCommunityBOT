const Discord = require("discord.js");

module.exports = {
    name: "messageReactionAdd",
    execute(messageReaction, user) {
        return
        if (user.bot) return
        if (messageReaction.message.channel.type == "dm") return
        if (messageReaction.message.guild.id != config.idServer) return

        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var userstats = userstatsList.find(x => x.id == user.id)
            if (!userstats) return

            userstats.statistics.addReaction++;

            database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
        })
    },
};