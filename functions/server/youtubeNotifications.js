const ytch = require("yt-channel-info")
const { getInfo } = require('ytdl-getinfo');
const settings = require("../../config/general/settings.json")

const youtubeNotifications = (client) => {
    ytch.getChannelVideos('UCK6QwAdGWOWN9AT1_UQFGtA', 'newest').then(async (response) => {
        let idVideo = response.items[0]?.videoId;
        if (!idVideo) return

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
-------------💻 **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** 💻-------------
Ehy ragazzi, è appena uscito un nuovo video su **GiulioAndCode**
Andate subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
<@&${settings.ruoliNotification.youtubeVideosCode}>
                `)
                                .then(async msg => {
                                    msg.crosspost()
                                })
                        })
                }
            });
    });

    ytch.getChannelVideos('UCvIafNR8ZvZyE5jVGVqgVfA', 'newest').then(async (response) => {
        let idVideo = response.items[0]?.videoId;
        if (!idVideo) return

        client.channels.cache.get(settings.idCanaliServer.youtubeNotification).messages.fetch().then(async (messages) => {
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
-------------✌ **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** ✌-------------
Ehy ragazzi, è appena uscito un nuovo video su **Giulio**
Andate subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
<@&${settings.ruoliNotification.youtubeVideosGiulio}>
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