setInterval(async function () {
    var data = new Date()
    if (data.getDate() == 1 && data.getMonth() == 3) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/mgJVddJf/Profilo-server-Pesce-aprile.png");
            await server.setBanner("https://i.postimg.cc/Xv5Ltf6Z/Banner-Pesce-Aprile.png");
            await client.user.setAvatar("https://i.postimg.cc/Cxzmsyvs/Profilo-bot-Pesce-aprile.png");
        }
    }

    if (data.getDate() == 2 && data.getMonth() == 3) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/Pr3QZdyC/Profilo-server.png");
            await server.setBanner("https://i.postimg.cc/L6MpWDdP/Banner.jpg");
            await client.user.setAvatar("https://i.postimg.cc/XvDRzMnq/Profilo-bot.png");
        }
    }
}, 1000)