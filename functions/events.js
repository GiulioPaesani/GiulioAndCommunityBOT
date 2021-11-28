//HALLOWEEN
setInterval(async function () {
    var data = new Date()
    if (data.getDate() == 1 && data.getMonth() == 11) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/tghCCrfn/Profilo-server-Christmas.png");
            await client.user.setAvatar("https://i.postimg.cc/vBtBXPtw/Profilo-bot-Christmas.png");
        }
    }

    if (data.getDate() == 7 && data.getMonth() == 0) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/Pr3QZdyC/Profilo-server.png");
            await client.user.setAvatar("https://i.postimg.cc/XvDRzMnq/Profilo-bot.png");
        }
    }
}, 1000)