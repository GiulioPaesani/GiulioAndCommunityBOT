const Discord = require('discord.js');
const client = new Discord.Client();
//var request = require('request');
const ytch = require('yt-channel-info')
client.login(process.env.token);

client.on("ready", () => {
    console.log("------------ONLINE------------")
})


//CANCELLARE COMANDO IN CANALE SBAGLIATO
client.on("message", (message) => {
    //Non ho aggiunto KitRobit, AXVin, Sesh, Serverstats, Xenon, 
    var BOT = {
        mee6: {
            comandi: ["!lastvideo", "!youtube", "!ban", "!tempban", "!clear", "!nfractions", "!kick", "!mute", "!tempmute", "!slowmode", "!unban", "!unmute", "!warm"],
            id: "159985870458322944",
            canaliPermessi: ["801019779480944660"]
        },
        voiceMaster: {
            comandi: ["%voice", "%voice lock", "%voice unlock", "%voice name", "%voice limit", "%voice permit", "%voice reject", "%voice claim", "@voicemaster myprefix", "%aboutme", "%stats", "%ping", "%invite"],
            id: "472911936951156740",
            canaliPermessi: ["801019779480944660"]
        },
        plasma: {
            comandi: ["$ranks", "$inviteinfo", "$invites"],
            id: "716967712844414996",
            canaliPermessi: ["801019779480944660"]
        },
        arcane: {
            comandi: ["+leaderboard", "+rank", "+level", "+rewards", "+userinfo", "+serverinfo"],
            id: "437808476106784770",
            canaliPermessi: ["801019779480944660"]
        },
        suggester: {
            comandi: [".suggest"],
            id: "564426594144354315",
            canaliPermessi: ["793781901688963104"]
        },
        carlBot: {
            comandi: ["?aesthetics", "?clap", "?double", "?clap", "?fancy", "?fraktur", "?smallcaps", "?clap", "?double"],
            id: "235148962103951360",
            canaliPermessi: ["801019779480944660"]
        },
        couting: {
            comandi: ["c!server", "c!cs", "c!slb", "c!user"],
            id: "510016054391734273",
            canaliPermessi: ["801019779480944660", "793781899796938802"]
        },
        dankMemer: {
            comandi: ["pls"],
            id: "270904126974590976",
            canaliPermessi: ["800040259983376414"]
        },
        ticket: {
            comandi: ["t!open"],
            id: "508391840525975553",
            canaliPermessi: ["801019779480944660"]
        },
        groovy: {
            comandi: ["-play", "-play file", "-join", "-queue", "-p", "-q", "-pf", "-f", "-j", "-nest", "-n", "-skip", "-back", "-b", "-previous", "-prev", "-clear", "-jump", "-j", "-goto", "-loop", "-lt", "-ls", "-lq", "-lyrics", "-ly", "-pause", "-resume", "-unpause", "-remove", "-r", "-rm", "-delete", "-del", "-rr", "-disconnect", "-dc", "-leave", "-reset", "-shuffle", "-shuff", "-shuf", "-randomize", "-randomise", "-song", "-nowplayling", "-np", "-reset effects", "-fast forward", "-ff", "-fwd", "-rewind", "-rw", "-search", "-s", "-seek", "-stop", "-move", "-m", "-prefix", "-announce", "-perms"],
            id: "234395307759108106",
            canaliPermessi: ["799969723776892969"]
        }

    }

    var canaleNonConcesso = new Discord.MessageEmbed()
        .setTitle(":no_entry_sign: Canale non concesso :no_entry_sign: ")
        .setColor("ff0000")

    if (message.author.bot) return;

    var trovato = false;
    var id;
    for (var i = 0; i < Object.keys(BOT).length; i++) {
        for (var x = 0; x < eval("BOT." + Object.keys(BOT)[0]).comandi.length; x++) {
            if (message.content.startsWith(eval("BOT." + Object.keys(BOT)[i]).comandi[x])) {
                if (!eval("BOT." + Object.keys(BOT)[i]).canaliPermessi.includes(message.channel.id)) {
                    id = eval("BOT." + Object.keys(BOT)[i]).id;
                    trovato = true;
                }
            }
        }
    }
    if (message.member.hasPermission("ADMINISTRATOR")) {
        return
    }

    if (trovato) {
        canaleNonConcesso.setDescription(message.author.toString() + " non puoi utilizzare i comandi di <@" + id + "> in questo canale!");
        message.channel.send(canaleNonConcesso)
            .then(msg => {
                msg.delete({ timeout: 5000 })
            })
        message.delete({ timeout: 5000 })
        return
    }
})

//Counter member
client.on("guildMemberAdd", member => {
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + member.guild.memberCount)
});
client.on("guildMemberRemove", member => {
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + member.guild.memberCount)
});

//Counter youtube
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get("801717800137129994")
        canale.setName("🎬│subscribers: " + response.subscriberCount)
    })
}, 1000 * 10)

client.on("message", message => {
    //TEST
    if (message.content == "!test") {
        message.channel.send("FUNZIONA TUTTO!")
    }
})
client.on("message", message => {
    if (message.channel != "801019779480944660" && message.channel != "793781905740922900" && message.channel != "793781906478858269") {
        return
    }
})

//YOUTUBE - LASTVIDEO
//https://www.npmjs.com/package/yt-channel-info
client.on("message", message => {
    if (message.content == "!youtube") {
        ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
            var youtube = new Discord.MessageEmbed()
                .setTitle("GiulioAndCode")
                .setColor("#41A9F6")
                .setURL(response.authorUrl)
                .setDescription(":love_you_gesture: Questo è il canale youtube **GiulioAndCode**\rIscriviti, lascia like, e attiva la campanellina")
                .setThumbnail(response.authorThumbnails[2].url)
            message.channel.send(youtube);
        })
    }
    if (message.content == "!lastvideo") {
        const channelId = 'UCK6QwAdGWOWN9AT1_UQFGtA'
        const sortBy = 'newest'
        ytch.getChannelVideos(channelId, sortBy).then((response) => {
            var lastVideo = new Discord.MessageEmbed()
                .setTitle(response.items[0].title)
                .setColor("#41A9F6")
                .setURL("https://www.youtube.com/watch?v=" + response.items[0].videoId)
                .setDescription(":love_you_gesture: Questo è l'ultimo video uscito su **GiulioAndCode**, vai subito a vederlo...\r :point_right:  https://www.youtube.com/watch?v=" + response.items[0].videoId)
                .setThumbnail(response.items[0].videoThumbnails[3].url)
                .addField(":eyes: Views", "```" + response.items[0].viewCount + "```", true)
                .addField(":film_frames: Duration", "```" + response.items[0].durationText + "```", true)
                .addField(":alarm_clock: Published", "```" + response.items[0].publishedText + "```", true)
            message.channel.send(lastVideo)
        })
    }
    /*if (message.content == "!youtubeinfo") {
        var id = "UCK6QwAdGWOWN9AT1_UQFGtA";
        var key = "AIzaSyAoPIQMri9i6iqvJKZX5rulsM3LWYyCjsk";
        var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + id + "&key=" + key;
        const channelId = 'UCK6QwAdGWOWN9AT1_UQFGtA'
        const sortBy = 'newest'

        request({
            method: 'GET',
            url: url
        }, function (err, response, text) {
            var json = JSON.parse(text);
            ytch.getChannelVideos(channelId, sortBy).then((responseVideo) => {
                ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
                    var lastVideo = responseVideo.items[0].title;
                    lastVideo = lastVideo.toString()
                    lastVideo = lastVideo.slice(0, 20)
                    lastVideo = lastVideo.trim();
                    lastVideo += "..."
                    console.log(response)

                    var youtubeInfo = new Discord.MessageEmbed()
                        .setTitle("GiulioAndCode Info")
                        .setURL(response.authorUrl)
                        .setColor("#41A9F6")
                        .setThumbnail(response.authorThumbnails[2].url)
                        .setDescription("Tutte le statistiche del canale youtube **GiulioAndCode**")
                        .addField(":bust_in_silhouette: Subscribers", "```" + response.subscriberCount + "```", true)
                        .addField(":eyes: Views", "```" + json.items[0].statistics.viewCount + "```", true)
                        .addField(":film_frames: Videos", "```" + json.items[0].statistics.videoCount + "```", true)
                        .addField("User created", "```May 5th, 2020```", true)
                        .addField("Last video", "[```" + lastVideo + "```](https://www.youtube.com/watch?v=" + responseVideo.items[0].videoId + ")", true)
                        .addField(":speech_balloon: Description", "```" + response.description + "```", false)

                    message.channel.send(youtubeInfo);
                })
            })

        });
    }*/
})

//SERVERINFO
client.on("message", message => {
    if (message.content == "!serverinfo" || message.content == "!serverstats") {
        var server = message.member.guild;
        var botCount = server.members.cache.filter(member => member.user.bot).size
        var memberCount = server.memberCount - botCount;

        var categoryCount = server.channels.cache.filter(c => c.type == "category").size;
        var textCount = server.channels.cache.filter(c => c.type == "text").size;
        var vocalCount = server.channels.cache.filter(c => c.type == "voice").size;

        var serverStats = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le statistiche su questo server")
            .setThumbnail(server.iconURL())
            .addField(":technologist: Owner", "```" + server.owner.user.username + "```", true)
            .addField(":placard: Server ID", "```" + server.id + "```", true)
            .addField(":map: Server region", "```" + server.region + "```", true)
            .addField(":busts_in_silhouette: Members", "```Total: " + server.memberCount + " | Members: " + memberCount + " | Bots: " + botCount + "```", false)
            .addField(":loud_sound: Server categories and channels", "```Category: " + categoryCount + " | Text: " + textCount + " | Voice: " + vocalCount + "```", false)
            .addField(":calendar_spiral: Server created", "```" + server.createdAt.toDateString() + "```", true)
            .addField(":beginner: Boost level", "```Level " + server.premiumTier + " (" + server.premiumSubscriptionCount + " boost)```", true)
        message.channel.send(serverStats)
    }
})
//USERINFO
client.on("message", message => {
    if (message.content.startsWith("!userinfo") || message.content.startsWith("!userstats")) {
        if (message.content.trim() == "!userinfo") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first()
        }

        if (!utente) {
            message.channel.send("Non ho trovato questo utente")
            return
        }

        var userStats = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("Tutte le statistiche su questo utente")
            .setThumbnail(utente.user.avatarURL())
            .addField(":receipt: User ID", "```" + utente.user.id + "```", true)
            .addField(":ok_hand: Status", "```" + utente.user.presence.status + "```", true)
            .addField(":shirt: Roles", "```" + utente.roles.cache.map(role => role.name).join(", ") + "```", true)
            .addField(":pencil: Account created", "```" + utente.user.createdAt.toDateString() + "```", true)
            .addField(":red_car: Joined this server", "```" + new Date(utente.joinedTimestamp).toDateString() + "```", true)
        message.channel.send(userStats)
    }


})