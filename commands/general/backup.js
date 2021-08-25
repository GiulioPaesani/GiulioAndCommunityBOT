const Discord = require("discord.js");
const { MessageAttachment } = require('discord.js');
const moment = require("moment")

module.exports = {
    name: "backup",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    execute(message, args, client) {
        database.collection("userstats").find().toArray(function (err, userstatsList) {
            if (err) return codeError(err);

            database.collection("serverstats").find().toArray(function (err, serverstats) {
                if (err) return codeError(err);

                var embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: New backup :inbox_tray:")
                    .setDescription("Backup di tutto il contenuto dei **database** di <@802184359120863272>")
                    .setColor("#757575")
                    .addField("Time", "```" + moment().format("dddd DD MMMM, HH:mm:ss") + "```")
                    
                var attachment1 = new MessageAttachment(Buffer.from(JSON.stringify(userstatsList, null, "\t")), "userstats.json");
                var attachment2 = new MessageAttachment(Buffer.from(JSON.stringify(serverstats, null, "\t")), "serverstats.json");
                
                var canale = client.channels.cache.get(config.idCanaliServer.log);
                canale.send(embed)
                    .then(msg =>{
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":inbox_tray: New backup :inbox_tray:")
                            .setDescription("Backup di tutto il contenuto dei **database** di <@802184359120863272>\r[Eccolo qui](https://discord.com/channels/793776260350083113/793781904973365299/" + msg.id + ")")
                            .setColor("#757575")
                            .addField("Time", "```" + moment().format("dddd DD MMMM, HH:mm:ss") + "```")

                        message.channel.send(embed)
                    })
                canale.send(attachment1);
                canale.send(attachment2);

            })
        })
    },
};
