//HALLOWEEN
setInterval(async function () {
    var data = new Date()
    if (data.getDate() == 31 && data.getMonth() == 9) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/NFWTJjzD/Profilo-server-Halloween.png");
            await client.user.setAvatar("https://i.postimg.cc/cLf7zfZn/Profilo-bot-Halloween.png");
        }
    }

    if (data.getDate() == 2 && data.getMonth() == 10) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/Pr3QZdyC/Profilo-server.png");
            await client.user.setAvatar("https://i.postimg.cc/XvDRzMnq/Profilo-bot.png");
        }
    }
}, 1000)