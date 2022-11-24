const ytch = require("yt-channel-info")
const { getInfo } = require('ytdl-getinfo');
const settings = require("../../config/general/settings.json")

const youtubeNotifications = (client) => {
    //GiulioAndCode
    ytch.getChannelVideos({ channelId: 'UCK6QwAdGWOWN9AT1_UQFGtA', sortBy: 'newest' }).then(async (response) => {
        let idVideo = response.items[0]?.videoId;
        if (!idVideo) return
        if (response.items[0]?.durationText == "SHORTS") return

        client.channels.cache.get(settings.idCanaliServer.youtubeNotification).messages.fetch()
            .then(async (messages) => {
                let isGiaMandato = false;
                await Array.from(messages.values()).forEach((msg) => {
                    if (msg.content.split('\n')[msg.content.split('\n').length - 2]?.endsWith(idVideo))
                        isGiaMandato = true;
                })

                if (!isGiaMandato) {
                    await getInfo(`https://www.youtube.com/watch?v=${idVideo}`)
                        .then(async (info) => {
                            let descriptionVideo = await JSON.stringify(info.items[0].description).split('\\n\\n')[0].slice(1);

                            await client.channels.cache.get(settings.idCanaliServer.youtubeNotification).send(`
----- :video_camera: **NEW VIDEO** :video_camera: -----
Ehy ragazzi, è appena uscito un nuovo video su **GiulioAndCode**
Andate subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
<@&${settings.ruoliNotification.video}>
                `)
                                .then(async msg => {
                                    msg.crosspost()
                                })
                        })
                }
            });
    });

    //Giulio
    ytch.getChannelVideos({ channelId: 'UCvIafNR8ZvZyE5jVGVqgVfA', sortBy: 'newest' }).then(async (response) => {
        let idVideo = response.items[0]?.videoId;
        if (!idVideo) return
        if (response.items[0]?.durationText == "SHORTS") return

        client.channels.cache.get(settings.idCanaliServer.youtubeNotification).messages.fetch()
            .then(async (messages) => {
                let isGiaMandato = false;
                await Array.from(messages.values()).forEach((msg) => {
                    if (msg.content.split('\n')[msg.content.split('\n').length - 2]?.endsWith(idVideo))
                        isGiaMandato = true;
                })

                if (!isGiaMandato) {
                    await getInfo(`https://www.youtube.com/watch?v=${idVideo}`)
                        .then(async (info) => {
                            let descriptionVideo = await JSON.stringify(info.items[0].description).split('\\n\\n')[0].slice(1);

                            await client.channels.cache.get(settings.idCanaliServer.youtubeNotification).send(`
----- :v: **NEW VIDEO** :v: -----
Ehy ragazzi, è appena uscito un nuovo video su **Giulio**
Andate subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
<@&${settings.ruoliNotification.video}>
                `)
                                .then(async msg => {
                                    msg.crosspost()
                                })
                        })
                }
            });
    });

    //GiulioAndLive
    ytch.getChannelVideos({ channelId: 'UCdwJnxZFfggSuXrLrc5sfPg', sortBy: 'newest' }).then(async (response) => {
        let idVideo = response.items[0]?.videoId;
        if (!idVideo) return
        if (response.items[0]?.durationText == "SHORTS") return

        client.channels.cache.get("1004644492776845392").messages.fetch().then(async (messages) => {
            let isGiaMandato = false;
            await Array.from(messages.values()).forEach((msg) => {
                if (msg.content.split('\n')[msg.content.split('\n').length - 1]?.endsWith(idVideo))
                    isGiaMandato = true;
            })

            if (!isGiaMandato) {
                await getInfo(`https://www.youtube.com/watch?v=${idVideo}`)
                    .then(async (info) => {
                        let descriptionVideo = await JSON.stringify(info.items[0].description).split('\\n\\n')[0].slice(1);

                        await client.channels.cache.get("1004644492776845392").send(`
----- 📡 **LIVE UPLOADED** 📡 -----
Ti sei perso la scorsa live su Twitch? Nessun problema, ora la puoi recuperare con tutta calma sul canale YouTube **GiulioAndLive**
Vai subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
                `)
                            .then(async msg => {
                                msg.crosspost()
                            })
                    })
            }
        });
    });
}

module.exports = { youtubeNotifications }