const Discord = require("discord.js");

module.exports = {
    name: "messageUpdate",
    execute(oldMessage, newMessage) {
        return
        if (!newMessage.author) return
        if (newMessage.author.bot) return
        if (newMessage.channel.type == "dm") return
        if (newMessage.guild.id != config.idServer) return

        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var userstats = userstatsList.find(x => x.id == newMessage.author.id)
            if (!userstats) return

            userstats.statistics.editMessage++;

            database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
        })
    },
};