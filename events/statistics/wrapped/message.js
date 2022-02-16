module.exports = {
    name: "messageCreate",
    async execute(message) {
        var date = new Date();
        if (date.getFullYear() != 2022) return

        if (isMaintenance()) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (!userstatsList) return

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return

        if (!userstats.wrapped) {
            userstats.wrapped = {
                "startTime": date.getTime(),
                "messages": {},
                "channels": {},
                "reactions": {},
                "words": {},
                "emojis": {},
                "commands": {},
                "vocalChannelsSeconds": 0,
                "startLevel": userstats.level,
                "startMoney": userstats.money ? userstats.money : 0,
            }
        }

        await message.guild.emojis.cache.forEach(emoji => {
            if (message.content.includes(`<:${emoji.name}:${emoji.id}>`)) {

                if (!userstats.wrapped.emojis[emoji.name])
                    userstats.wrapped.emojis[emoji.name] = 0

                var i = 0;
                var contenuto = message.content
                while (contenuto.includes(`<:${emoji.name}:${emoji.id}>`)) {
                    i++
                    contenuto = contenuto.replace(`<:${emoji.name}:${emoji.id}>`, "")
                }

                userstats.wrapped.emojis[emoji.name] = userstats.wrapped.emojis[emoji.name] + i

                message.content = message.content.replace(eval(`/<:${emoji.name}:${emoji.id}>/g`), "")
            }
            if (message.content.includes(`<a:${emoji.name}:${emoji.id}>`)) {

                if (!userstats.wrapped.emojis[emoji.name])
                    userstats.wrapped.emojis[emoji.name] = 0

                var i = 0;
                var contenuto = message.content
                while (contenuto.includes(`<a:${emoji.name}:${emoji.id}>`)) {
                    i++
                    contenuto = contenuto.replace(`<a:${emoji.name}:${emoji.id}>`, "")
                }

                userstats.wrapped.emojis[emoji.name] = userstats.wrapped.emojis[emoji.name] + i

                message.content = message.content.replace(eval(`/<a:${emoji.name}:${emoji.id}>/g`), "")
            }
        })

        if (message.content.match(/(:[^:\s]+:|<:[^:\s]+:[0-9]+>|<a:[^:\s]+:[0-9]+>)/g)) {
            message.content.match(/(:[^:\s]+:|<:[^:\s]+:[0-9]+>|<a:[^:\s]+:[0-9]+>)/g).forEach(x => message.content = message.content.replace(x, ""))
        }

        var words = message.content.toLowerCase().replace(/\s+|\r?\n|\r/gmi, " ").split(/ +/).map(x => x.replace(/[^a-z]|\s+|\r?\n|\r/gmi, "")).filter(x => x.length >= 3)
        words.forEach(word => {
            if (!userstats.wrapped.words[word])
                userstats.wrapped.words[word] = 0

            userstats.wrapped.words[word] = userstats.wrapped.words[word] + 1
        })

        var dayCode = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${(date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)}`

        if (!userstats.wrapped.messages[dayCode])
            userstats.wrapped.messages[dayCode] = 0

        userstats.wrapped.messages[dayCode] = userstats.wrapped.messages[dayCode] + 1

        if (!userstats.wrapped.channels[message.channel.id])
            userstats.wrapped.channels[message.channel.id] = 0

        userstats.wrapped.channels[message.channel.id] = userstats.wrapped.channels[message.channel.id] + 1

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};

setInterval(() => {
    if (!userstatsList) return

    var date = new Date();
    if (date.getFullYear() != 2022) return

    if (isMaintenance()) return

    var server = client.guilds.cache.get(settings.idServer)
    if (!server) return
    server.channels.cache.filter(x => x.type == "GUILD_VOICE").forEach(channel => {
        channel.members.forEach(member => {

            var userstats = userstatsList.find(x => x.id == member.id);
            if (!userstats) return

            if (!userstats.wrapped) {
                userstats.wrapped = {
                    "startTime": date.getTime(),
                    "messages": {},
                    "channels": {},
                    "reactions": {},
                    "words": {},
                    "emojis": {},
                    "commands": {},
                    "vocalChannelsSeconds": 0,
                    "startLevel": userstats.level,
                    "startMoney": userstats.money ? userstats.money : 0,
                }
            }

            userstats.wrapped.vocalChannelsSeconds = userstats.wrapped.vocalChannelsSeconds + 1

            userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        });
    })
}, 1000)