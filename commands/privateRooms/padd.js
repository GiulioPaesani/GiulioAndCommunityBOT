module.exports = {
    name: "padd",
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
                .setColor("#F15A24")
                .setDescription(`Non puoi utilizzare il comando \`!padd\` in questo canale`)

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

        const permissions = new Discord.Permissions(canale.permissionOverwrites.get(everyone.id).allow.bitfield);

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

        if (room.bans.includes(utente.id)) {
            warning(message, "Utente bannato", room.type == "onlyText" || room.type == "onlyVoice" ? "Questo utente è bannato dalla tua stanza" : "Questo utente è bannato dalle tue stanze")
            return
        }

        const hasPermissionInChannel = canale
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            warning(message, "Questo utente è già presente", room.type == "onlyText" || room.type == "onlyVoice" ? "Questo utente ha già accesso alla tua stanza privata" : "Questo utente ha già accesso alle tue stanze private")
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

        correct(message, "Utente aggiunto", room.type == "onlyText" || room.type == "onlyVoice" ? `${utente.toString()} è stato aggiunto alla tua stanza` : `${utente.toString()} è stato aggiunto alle tue stanze`)
    },
};
