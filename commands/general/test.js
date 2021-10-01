const Discord = require("discord.js");
const ms = require("ms");
const moment = require("moment")

module.exports = {
    name: "test",
    aliases: ["prova", "ping"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("GiulioAndCommunity BOT")
            .setThumbnail("https://i.postimg.cc/pLYkGfD1/Profilo-bot.png")
            .setColor("#6CA1FF")
            .addField(":stopwatch: Uptime", "```" + `${ms(client.uptime, { long: true })} - ${moment(new Date().getTime() - client.uptime).format("ddd DD MMM, HH:mm:ss")}` + "```")
            .addField(":turtle: Ping", "```" + `${client.ws.ping}ms` + "```", true)
            .addField(":floppy_disk: Ram", "```" + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` + "```", true)
        message.channel.send(embed)

        client.YTP.getAllChannels(message.guild.id)
            .then(chs => {
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
