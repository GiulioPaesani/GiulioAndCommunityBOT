const Discord = require("discord.js");
const { Permissions } = require("discord.js")

module.exports = {
    name: "premove",
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
                .setDescription(`Non puoi utilizzare il comando \`!premove\` in questo canale`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 15000 }).catch(() => { return })
                msg.delete({ timeout: 15000 }).catch(() => { return })
            })
            return
        }

        if (room.text)
            var canale = client.channels.cache.get(room.text)
        if (room.voice)
            var canale = client.channels.cache.get(room.voice)
        if (!canale) return

        var everyone = message.guild.roles.cache.find(r => r.name === "@everyone");

        const permissions = new Permissions(canale.permissionOverwrites.get(everyone.id).allow.bitfield);

        if (permissions.toArray().includes("VIEW_CHANNEL")) {
            warning(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "Stanza pubbliche" : "Stanze pubbliche"}`, room.type == "onlyText" || room.type == "onlyVoice" ? "Non puoi aggiungere utenti alla stanza se è pubblica" : "Non puoi aggiungere utenti alle stanze se sono pubbliche")
            return
        }

        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!padd [user]`")
            return
        }

        const hasPermissionInChannel = canale
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (!hasPermissionInChannel) {
            warning(message, "Questo utente è già rimosso", room.type == "onlyText" || room.type == "onlyVoice" ? "Questo utente non ha già accesso alla tua stanza privata" : "Questo utente non ha già accesso alle tue stanze private")
            return
        }

        if (message.member.id == utente.id) {
            warning(message, "Non ti puoi rimuovere", room.type == "onlyText" || room.type == "onlyVoice" ? "Non puoi rimuoverti dalla stanza da solo" : "Non puoi rimuoverti dalle stanze da solo")
            return
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.updateOverwrite(utente, {
                VIEW_CHANNEL: false
            })
        }
        if (room.voice) {
            if (utente.voice && utente.voice.channelID == room.voice) utente.voice.kick()
            var canale = client.channels.cache.get(room.voice)
            canale.updateOverwrite(utente, {
                VIEW_CHANNEL: false
            })
        }

        correct(message, "Utente rimosso", room.type == "onlyText" || room.type == "onlyVoice" ? `${utente.toString()} è stato rimosso dalla tua stanza` : `${utente.toString()} è stato rimosso dalle tue stanze`)
    },
};
