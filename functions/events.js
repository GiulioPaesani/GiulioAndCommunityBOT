//HALLOWEEN
setInterval(async function () {
    var data = new Date()
    if (data.getDate() == 14 && data.getMonth() == 1) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/WtcRmqpY/Profilo-San-Valentino.png");
            await client.user.setAvatar("https://i.postimg.cc/FzL5JVvJ/Profilo-bot-San-Valentino.png");
        }
    }

    if (data.getDate() == 15 && data.getMonth() == 1) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/Pr3QZdyC/Profilo-server.png");
            await client.user.setAvatar("https://i.postimg.cc/XvDRzMnq/Profilo-bot.png");
        }
    }
}, 1000)