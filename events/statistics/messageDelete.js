const Discord = require("discord.js");

module.exports = {
    name: "messageDelete",
    execute(message) {
        return
        if (!message.author) return
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.guild.id != config.idServer) return

        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var userstats = userstatsList.find(x => x.id == message.author.id)
            if (!userstats) return

            userstats.statistics.deleteMessage++;

            database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
        })
    },
};