const Discord = require("discord.js");

module.exports = {
    name: "punban",
    aliases: [],
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
                .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                .setColor("#F15A24")
                .setDescription(`Non puoi utilizzare il comando \`!punban\` in questo canale`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 15000 }).catch(() => { return })
                msg.delete({ timeout: 15000 }).catch(() => { return })
            })
            return
        }

        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!punban [user]`")
            return
        }

        if (!room.bans.includes(utente.id)) {
            warning(message, "Utente non bannato", `${room.type == "onlyText" || room.type == "onlyVoice" ? "Questo utente non è bannato dalla tua stanza" : "Questo utente non è bannato dalle tue stanze"}`)
            return
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.updateOverwrite(utente, {
                VIEW_CHANNEL: true
            })
        }
        if (room.voice) {
            var canale = client.channels.cache.get(room.voice)
            canale.updateOverwrite(utente, {
                VIEW_CHANNEL: true
            })
        }

        serverstats.privateRooms.find(x => x.owner == room.owner).bans.filter(x => x != utente.id)

        correct(message, "Utente sbannato", `${room.type == "onlyText" || room.type == "onlyVoice" ? `${utente.toString()} è stato sbannato dalla tua stanza` : `${utente.toString()} è stato sbannato dalle tue stanze`}`)
    },
};
