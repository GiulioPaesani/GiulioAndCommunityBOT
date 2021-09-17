const Discord = require("discord.js");

module.exports = {
    name: "plimit",
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
                .setDescription(`Non puoi utilizzare il comando \`!plimit\` in questo canale`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 15000 }).catch(() => { return })
                msg.delete({ timeout: 15000 }).catch(() => { return })
            })
            return
        }

        if (room.type == "onlyText") {
            warning(message, `Non hai una stanza vocale`, "Puoi impostare un limite di utenti solo se hai una stanza vocale")
            return
        }

        var canale = client.channels.cache.get(room.voice)
        if (!canale) return

        var everyone = message.guild.roles.cache.find(r => r.name === "@everyone");
        const permissions = new Permissions(canale.permissionOverwrites.get(everyone.id).deny.bitfield);

        if (permissions.toArray().includes("VIEW_CHANNEL")) {
            warning(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "Stanza privata" : "Stanze private"}`, "Non puoi impostare un limite in una stanza privata")
            return
        }

        var count = parseInt(args[0])
        if (!count) {
            error(message, "Inserire un valore valido", "`!plimit [count]`")
            return
        }

        if (count > 99) {
            warning(message, "Limite troppo alto", "Non puoi impostare un limite maggiore di 99 utenti")
            return
        }

        canale.setUserLimit(count);
        correct(message, "Limite impostato", `Limite di utenti impostato a \`${count}\``)
    },
};
