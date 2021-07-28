const Discord = require("discord.js");
const moment = require("moment")
const fetch = require("node-superfetch")

module.exports = {
    name: "youtubestats",
    aliases: ["youtubeinfo"],
    onlyStaff: false,
    channelsGranted: ["869975190052929566"],
    async execute(message, args, client) {
        const channel = await fetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=GiulioAndCode&key=${process.env.apikey}&maxResults=1&type=channel`)

        const data = await fetch.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channel.body.items[0].id.channelId}&key=${process.env.apikey}`)

        let embed = new Discord.MessageEmbed()
            .setTitle("YOUTUBESTATS - GiulioAndCode")
            .addField(":eyes: Views", "```" + data.body.items[0].statistics.viewCount + "```", true)
            .addField(":busts_in_silhouette: Subscriber", "```" + data.body.items[0].statistics.subscriberCount + "```", true)
            .addField(":film_frames: Video", "```" + data.body.items[0].statistics.videoCount + "```", true)
            .addField(":page_facing_up: Description", "```" + data.body.items[0].brandingSettings.channel.description + "```", false)
            .addField(":alarm_clock: Channel created", "```" + moment(JSON.parse(data.text).items[0].snippet.publishedAt).format("ddd DD MMM, HH:mm") + " (" + moment(JSON.parse(data.text).items[0].snippet.publishedAt).fromNow() + ")```", true)
            .addField(":pencil: Channel keywords", "```" + data.body.items[0].brandingSettings.channel.keywords + "```", false)
        message.channel.send(embed)
    },
};