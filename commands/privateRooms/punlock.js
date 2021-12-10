module.exports = {
    name: "punlock",
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
                .setDescription(`Il comando \`!punlock\` non esiste`)
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
                .setDescription(`Il comando \`!punlock\` non esiste`)
                .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")

            if (!utenteMod(message.author))
                message.channel.send(embed).then((msg) => {
                    message.delete({ timeout: 20000 }).catch(() => { });
                    msg.delete({ timeout: 20000 }).catch(() => { });
                });
            return
        }

        var avvento = serverstats.avvento[message.author.id]
        if (!avvento) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Ricompensa non ancora riscattata")
                .setColor(`#8F8F8F`)
                .setDescription("Vai in <#907340145383047168> per riscattare la possibilità di rendere pubblica la tua stanza del giorno 11")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        if (!avvento[11]) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Ricompensa non ancora riscattata")
                .setColor(`#8F8F8F`)
                .setDescription("Vai in <#907340145383047168> per riscattare la possibilità di rendere pubblica la tua stanza del giorno 11")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

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

        if (!permissions.toArray().includes("VIEW_CHANNEL")) {
            warning(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "Stanza già pubblica" : "Stanze già pubbliche"}`, room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale è già accessibile a tutti" : "I tuoi canali privati sono già accessibili a tutti")
            return
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.updateOverwrite(everyone, {
                VIEW_CHANNEL: true,
            })
        }
        if (room.voice) {
            var canale = client.channels.cache.get(room.voice)
            canale.setUserLimit(null)
                .then(() => {
                    canale.updateOverwrite(everyone, {
                        VIEW_CHANNEL: true,
                    })
                })
        }

        correct(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "La stanza è ora pubblica" : "Le stanze sono ora pubbliche"}`, room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale privato ora è accessibile a tutti" : "I tuoi canali privati ora sono accessibili a tutti")
    },
};
