module.exports = {
    name: "plock",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        var day = new Date().getDate()
        var month = new Date().getMonth()

        if (month == 11 || (month == 0 && day <= 6)) {

        }
        else {
            let embed = new Discord.MessageEmbed()
                .setTitle("Comando non esistente")
                .setColor("#FF931E")
                .setDescription(`Il comando \`!plock\` non esiste`)
                .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")

            if (!utenteMod(message.member)) //Se l"utente non è staff
                message.channel.send(embed)
                    .then(msg => {
                        message.delete({ timeout: 15000 })
                            .catch(() => { })
                        msg.delete({ timeout: 15000 })
                            .catch(() => { })
                    })
            return
        }

        if (month == 11 && day < 11) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Comando non esistente")
                .setColor("#FF931E")
                .setDescription(`Il comando \`!plock\` non esiste`)
                .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")

            if (!utenteMod(message.author))
                message.channel.send(embed).then((msg) => {
                    message.delete({ timeout: 20000 }).catch(() => { });
                    msg.delete({ timeout: 20000 }).catch(() => { });
                });
            return
        }

        var privaterooms = serverstats.privateRooms

        if (!privaterooms.find(x => x.owner == message.author.id)) {
            warning(message, "Non hai una stanza", "Per usare questo comando devi essere owner di una stanza privata")
            return
        }

        var room = privaterooms.find(x => x.owner == message.author.id)

        if (message.channel.id == config.idCanaliServer.commands || (room.text && message.channel.id == room.text)) {

        }
        else {
            var embed = new Discord.MessageEmbed()
                .setTitle("Canale non concesso")
                .setColor("#F15A24")
                .setDescription(`Non puoi utilizzare il comando \`!plock\` in questo canale`)

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/kXkwZ1dw/Not-Here-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
            }

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 15000 })
                    .catch(() => { })
                msg.delete({ timeout: 15000 })
                    .catch(() => { })
            })
            return
        }

        if (room.text)
            var canale = client.channels.cache.get(room.text)
        if (room.voice)
            var canale = client.channels.cache.get(room.voice)
        if (!canale) return

        var everyone = message.guild.roles.cache.find(r => r.name === "@everyone");

        const permissions = new Discord.Permissions(canale.permissionOverwrites.get(everyone.id).deny.bitfield);

        if (permissions.toArray().includes("VIEW_CHANNEL")) {
            warning(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "Stanza già privata" : "Stanze già private"}`, room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale è già accessibile solo da chi inviti" : "I tuoi canali privati sono già accessibili solo da chi inviti")
            return
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.updateOverwrite(everyone, {
                VIEW_CHANNEL: false,
            })
        }
        if (room.voice) {
            var canale = client.channels.cache.get(room.voice)
            canale.setUserLimit(null)
                .then(() => {
                    canale.updateOverwrite(everyone, {
                        VIEW_CHANNEL: false,
                    })
                })
        }

        correct(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "La stanza è ora privata" : "Le stanze sono ora private"}`, room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale privato ora è accessibile solo da chi inviti" : "I tuoi canali privati ora sono accessibili solo da chi inviti")
    },
};
