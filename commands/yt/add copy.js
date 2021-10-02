const Discord = require("discord.js");
const ms = require("ms");
const moment = require("moment")

module.exports = {
    name: "all",
    aliases: ["prova", "ping"],
    onlyStaff: true,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {

        client.YTP.getAllChannels(message.guild.id)
            .then(chs => {
                console.log(chs)
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send information, you could do a chs.map(ch=>ch.YTchannel)...
                message.channel.send({
                    embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`There are ${chs.length} Channels Setupped!`)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
    },
};
