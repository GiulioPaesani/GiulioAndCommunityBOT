const Discord = require("discord.js");
const ytch = require('yt-channel-info');

module.exports = {
    name: "youtube",
    aliases: ["yt"],
    onlyStaff: false,
    channelsGranted: ["801019779480944660"],
    execute(message, args, client) {
        ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
            let youtube = new Discord.MessageEmbed()
                .setTitle("GiulioAndCode")
                .setColor("#41A9F6")
                .setURL(response.authorUrl)
                .setDescription(":love_you_gesture: Questo è il canale youtube **GiulioAndCode**\rIscriviti, lascia like, e attiva la campanellina")
                .setThumbnail("https://i.postimg.cc/fLLYRp8J/Profilo2-PNG.png")
            message.channel.send(youtube);
        })
    },
};