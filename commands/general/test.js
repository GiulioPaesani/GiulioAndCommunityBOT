const Discord = require("discord.js");
const ms = require("ms");
const moment = require("moment")

module.exports = {
    name: "test",
    aliases: ["prova", "ping"],
    onlyStaff: false,
    channelsGranted: ["801019779480944660"],
    execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("GiulioAndCommunity BOT")
            .setThumbnail("https://i.postimg.cc/pLYkGfD1/Profilo-bot.png")
            .setColor("#6CA1FF")
            .addField(":alarm_clock: Uptime", `${ms(client.uptime, { long: true })} - ${moment(new Date().getTime() - client.uptime).format("ddd DD MMM, HH:mm:ss")}`)
            .addField(":turtle: Ping", `${client.ws.ping}ms`)
            .addField(":floppy_disk: Ram", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
        message.channel.send(embed)
    },
};
