module.exports = {
    name: "pdelete",
    aliases: ["pclose"],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
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
                .setDescription(`Non puoi utilizzare il comando \`!pdelete\` in questo canale`)

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

        var embed = new Discord.MessageEmbed()
            .setTitle(`${room.type == "onlyText" || room.type == "onlyVoice" ? "Stanza" : "Stanze"} eliminata`)
            .setColor(`#16A0F4`)
            .setDescription(room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale privato si eliminerà a breve" : "I tuoi canali privati si elimineranno a breve")

        var data = new Date()
        if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
            embed.setThumbnail("https://i.postimg.cc/NFXTGVdf/Correct-Halloween.png")
        }
        else {
            embed.setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
        }

        message.channel.send(embed)

        setTimeout(() => {
            if (room.text && client.channels.cache.get(room.text))
                client.channels.cache.get(room.text).delete()
                    .catch(() => { })
            if (room.voice && client.channels.cache.get(room.voice))
                client.channels.cache.get(room.voice).delete()
                    .catch(() => { })
        }, 1000 * 10)

        serverstats.privateRooms = serverstats.privateRooms.filter(x => x.owner != message.author.id)
    },
};
