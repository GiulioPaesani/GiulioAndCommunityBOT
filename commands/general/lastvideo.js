const Discord = require("discord.js");
const ytch = require('yt-channel-info');
const { getInfo } = require('ytdl-getinfo')

module.exports = {
    name: "lastvideo",
    aliases: ["ultimovideo"],
    onlyStaff: false,
    channelsGranted: ["869975190052929566"],
    async execute(message, args, client) {
        const channelId = 'UCK6QwAdGWOWN9AT1_UQFGtA'
        const sortBy = 'newest'
        ytch.getChannelVideos(channelId, sortBy).then(async (response) => {
            var video1 = await getInfo(`https://www.youtube.com/watch?v=${response.items[1].videoId}`)
            var video2 = await getInfo(`https://www.youtube.com/watch?v=${response.items[2].videoId}`)
            var video3 = await getInfo(`https://www.youtube.com/watch?v=${response.items[3].videoId}`)
            getInfo(`https://www.youtube.com/watch?v=${response.items[0].videoId}`).then(async info => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(response.items[0].title)
                    .setColor("#41A9F6")
                    .setDescription(":love_you_gesture: Questo è l'ultimo video uscito su **GiulioAndCode**, vai subito a vederlo...\rhttps://www.youtube.com/watch?v=" + response.items[0].videoId)
                    .setThumbnail(response.items[0].videoThumbnails[3].url)
                    .addField(":eyes: Views", "```" + response.items[0].viewCount + "```", true)
                    .addField(":film_frames: Duration", "```" + response.items[0].durationText + "```", true)
                    .addField(":alarm_clock: Published", "```" + response.items[0].publishedText + "```", true)
                    .addField(":thumbsup: Like", "```" + info.items[0].like_count + "```", true)
                    .addField(":thumbsdown: Dislike", "```" + info.items[0].dislike_count + "```", true)
                    .addField(":safety_pin: Tags", "```" + info.items[0].tags.join(", ") + "```", false)
                    .addField(":projector: Other...", `
[${response.items[1].title.length > 40 ? (response.items[1].title.slice(0, 40) + "...") : response.items[1].title}](https://www.youtube.com/watch?v=${response.items[1].videoId}) - ${video1.items[0].upload_date.slice(6)}/${video1.items[0].upload_date.slice(4, -2)}/${video1.items[0].upload_date.slice(0, -6)}
[${response.items[2].title.length > 40 ? (response.items[2].title.slice(0, 40) + "...") : response.items[2].title}](https://www.youtube.com/watch?v=${response.items[2].videoId}) - ${video2.items[0].upload_date.slice(6)}/${video2.items[0].upload_date.slice(4, -2)}/${video2.items[0].upload_date.slice(0, -6)}
[${response.items[3].title.length > 40 ? (response.items[3].title.slice(0, 40) + "...") : response.items[3].title}](https://www.youtube.com/watch?v=${response.items[3].videoId}) - ${video3.items[0].upload_date.slice(6)}/${video3.items[0].upload_date.slice(4, -2)}/${video3.items[0].upload_date.slice(0, -6)}`)

                message.channel.send(embed)
            })
        })
    },
};