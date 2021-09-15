const Discord = require("discord.js");
const { Permissions } = require("discord.js")

module.exports = {
    name: "plock",
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
                .setDescription(`Non puoi utilizzare il comando \`!plock\` in questo canale`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 15000 }).catch(() => { return })
                msg.delete({ timeout: 15000 }).catch(() => { return })
            })
            return
        }

        if (room.text)
            var canale = client.channels.cache.get(room.text)
        if (room.voice)
            var canale = client.channels.cache.get(room.text)

        var everyone = message.guild.roles.cache.find(r => r.name === "@everyone");

        const permissions = new Permissions(canale.permissionOverwrites.get(everyone.id).deny.bitfield);

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

        correct(message, `${room.type == "onlyText" || room.type == "onlyVoice" ? "Stanza" : "Stanze"} pubblico`, room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale privato ora è accessibile solo da chi inviti" : "I tuoi canali privati ora sono accessibili solo da chi inviti")
    },
};
