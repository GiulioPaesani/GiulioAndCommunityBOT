module.exports = {
    name: "message",
    async execute(message) {
        if (message.channel.type == "dm" && message.content.startsWith("!")) {
            let embed = new Discord.MessageEmbed()
                .setTitle("DM non abilitati")
                .setColor("#F15A24")
                .setDescription("I comandi nei messaggi privati non sono abilitati")

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/kXkwZ1dw/Not-Here-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
            }

            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 15000 })
                    .catch(() => { })
            })
            return
        }

        if (message.channel.type == "dm") return
        if (message.author.bot) return
        if (message.guild.id != config.idServer) return //Server sconosciuti non accettati

        trovata = getParolaccia(message.content)[0];
        if (trovata && !utenteMod(message.member)) return

        message.content = message.content.toLowerCase().trim();

        if ([config.idCanaliServer.welcome, config.idCanaliServer.announcements, config.idCanaliServer.rules, config.idCanaliServer.info, config.idCanaliServer.youtubeNotification, config.idCanaliServer.becomeHelper, config.idCanaliServer.staffHelp, config.idCanaliServer.levelUp, config.idCanaliServer.log, config.idCanaliServer.privateRooms, config.idCanaliServer.mutedTicket, config.idCanaliServer.tempmutedTicket, config.idCanaliServer.bannedTicket, config.idCanaliServer.tempbannedTicket, config.idCanaliServer.lockdown].includes(message.channel.id)) {
            if (message.author.id != config.idGiulio)
                message.delete()
                    .catch(() => { })
        }

        //REACTION MESSAGE
        if (message.content == "wow")
            message.react("<:GiulioWow:830376945107206174>")
        if (message.content == "rip")
            message.react("<:GiulioRip:809526422758490163>")
        if (message.content == "sad" || message.content == "piango" || message.content == "triste" || message.content == "sono triste")
            message.react("<:GiulioPiangere:809526423886364722>")
        if (message.content == "ok" || message.content == "okay")
            message.react("<:GiulioOK:820026506024714310>")
        if (message.content == "love" || message.content == "amore" || message.content == "ti amo")
            message.react("<:GiulioLove:809526404373807154>")
        if (message.content == "lol")
            message.react("<:GiulioLOL:820012281693077554>")
        if (message.content == "ciao" || message.content == "hi" || message.content == "hello")
            message.react("<:GiulioHi:809526403832872980>")
        if (message.content == "gg")
            message.react("<:GiulioGG:809526405929893900>")
        if (message.content == "f")
            message.react("<:GiulioF:820012279079763979>")
        if (message.content == "cosa?" || message.content == "non ho capito" || message.content == "cosa? non ho capito")
            message.react("<:GiulioDomandoso:809526406555238512>")
        if (message.content == "buonanotte" || message.content == "notte" || message.content == "buona notte" || message.content == "ho sonno")
            message.react("<:GiulioBuonanotte:809526879048040459>")
        if (message.content == "cool" || message.content == "figo")
            message.react("<:GiulioCool:809526407268794418>")
        if (message.content == "ban")
            message.react("<:GiulioBan:809526406442123325>")
    },
};