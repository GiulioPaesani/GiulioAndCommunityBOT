module.exports = {
    name: "Lastvideo",
    aliases: ["ultimovideo", "lastvideo youtube", "lastvideoyoutube"],
    description: "Ottenere l'**ultimo video** uscito su un canale YouTube",
    info: "Prima di utilizzare il comando è necessario installare la libraria yt-channel-info (scrivi nel terminal `npm i yt-channel-info`)",
    category: "commands",
    id: "1639466164",
    link: "https://www.toptal.com/developers/hastebin/iyidufuhaf.js",
    video: "",
    code: `
const ytch = require('yt-channel-info');
client.on("messageCreate", message => {
    if (message.content == "!lastvideo") {
        const channelId = 'idCanaleYoutube' //Settare id del tuo canale YouTube
        ytch.getChannelVideos(channelId, "newest").then((response) => {
            let embed = new Discord.MessageEmbed()
                .setTitle(response.items[0].title)
                .setURL("https://www.youtube.com/watch?v=" + response.items[0].videoId)
                .setThumbnail(response.items[0].videoThumbnails[3].url)
                .addField("Views", response.items[0].viewCount.toString(), true)
                .addField("Duration", response.items[0].durationText, true)
                .addField("Published", response.items[0].publishedText, true)
            message.channel.send({embeds: [embed]})
        })
    }
})`
};
