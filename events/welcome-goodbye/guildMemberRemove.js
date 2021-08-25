const Discord = require("discord.js");
const moment = require("moment")

module.exports = {
    name: `guildMemberRemove`,
    async execute(member) {
        if (member.user.bot) return
        if (member.guild.id != config.idServer) return

        const { database, db } = await getDatabase()
        await database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var userstats = userstatsList.find(x => x.id == member.id)
            if (!userstats) return

            userstats.roles = member._roles;
            database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });

            var elencoRuoli = "";
            for (var i = 0; i < member._roles.length; i++) {
                elencoRuoli += `<@&${member._roles[i]}>\r`;
            }

            var embed = new Discord.MessageEmbed()
                .setAuthor(`[GOODBYE] ${member.user.username}#${member.user.discriminator}`, member.user.avatarURL())
                .addField("Time on server", moment(new Date().getTime()).from(moment(member.joinedTimestamp), true))
                .setThumbnail("https://i.postimg.cc/qqGBCzG1/Goodbye.png")
                .setColor("#FC1D24")
                .setFooter(`User ID: ${member.id}`)

            if (elencoRuoli != "")
                embed.addField("Roles", elencoRuoli)

            var canale = client.channels.cache.get(config.idCanaliServer.log);
            canale.send(embed);
            await db.close()
        })
    },
};
