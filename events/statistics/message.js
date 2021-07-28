const Discord = require("discord.js");

module.exports = {
    name: "message",
    execute(message) {
        return
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.guild.id != config.idServer) return

        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var userstats = userstatsList.find(x => x.id == message.author.id)
            if (!userstats) return

            userstats.statistics.totalMessage++;

            database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
        })
    },
};