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

            var canale = await client.channels.cache.get("907340145383047168");
            canale.updateOverwrite(server.roles.everyone, {
                VIEW_CHANNEL: true,
            })

            server.channels.cache.forEach(canale => {
                if (canale.parentID == "869975171115679794" && canale.id != "878695993628061727") {
                    canale.updateOverwrite(server.roles.everyone, {
                        VIEW_CHANNEL: true,
                    })
                }
            })

            var role = await server.roles.cache.find(x => x.id == "910625247131209778")
            role.delete()
            var role = await server.roles.cache.find(x => x.id == "909817687260139520")
            role.delete()
            var role = await server.roles.cache.find(x => x.id == "909817256769380412")
            role.delete()
        }
    }
}, 1000)