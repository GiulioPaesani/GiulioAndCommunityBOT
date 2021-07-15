module.exports = {
    name: "lastvideo",
    aliases: ["ultimovideo","lastvideo youtube","lastvideoyoutube"],
    description: "Ottenere l'**ultimo video** uscito su un canale YouTube",
    info: "Prima di utilizzare il comando è necessario installare la libraria yt-channel-info (`npm i yt-channel-info`)",
    video: "",
    code: `
const ytch = require('yt-channel-info');
client.on("message", message => {
    if (message.content == "!lastvideo") {
        const channelId = 'idCanaleYoutube' //Settare id del tuo canale YouTube
        const sortBy = 'newest'
        ytch.getChannelVideos(channelId, sortBy).then((response) => {
            var lastVideo = new Discord.MessageEmbed()
                .setTitle(response.items[0].title)
                .setURL("https://www.youtube.com/watch?v=" + response.items[0].videoId)
                .setThumbnail(response.items[0].videoThumbnails[3].url)
                .addField("Views", response.items[0].viewCount, true)
                .addField("Duration", response.items[0].durationText, true)
                .addField("Published", response.items[0].publishedText, true)
            message.channel.send(lastVideo)
        })
    }
})`
};
