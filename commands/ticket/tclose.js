module.exports = {
    name: "tclose",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Canale non concesso")
                .setColor("#F15A24")
                .setDescription("Non puoi utilizzare il comando `!tclose` in questo canale")

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/kXkwZ1dw/Not-Here-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
            }

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 10000 })
                    .catch(() => { })
                msg.delete({ timeout: 10000 })
                    .catch(() => { })
            })
            return
        }

        var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
        var ticket = serverstats.ticket[index];

        if (!utenteMod(message.member) && message.author.id != ticket.owner && !message.member.roles.cache.has(config.idRuoloAiutante) && !message.member.roles.cache.has(config.idRuoloAiutanteInProva)) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Non hai il permesso")
                .setColor("#9E005D")
                .setDescription("Non puoi eseguire il comando `!tclose` in questo canale")

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
            }

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 10000 })
                    .catch(() => { })
                msg.delete({ timeout: 10000 })
                    .catch(() => { })
            })
            return
        }


        client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
            .then(msg => {
                if (ticket.type == "Normal") {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Ticket aperto")
                        .setColor("#4b9afa")
                        .setDescription("In questa chat potrai richiedere **supporto privato** allo staff")
                }
                if (ticket.type == "Moderation") {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Segnalazione aperta")
                        .setColor("#6143CB")
                        .setDescription("In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione")
                }

                msg.edit({
                    component: null,
                    embed: embed
                });
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Ticket in eliminazione")
            .setColor("#16A0F4")
            .setDescription("Questo ticket si cancellerà tra 10 secondi")

        var data = new Date()
        if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
            embed.setThumbnail("https://i.postimg.cc/NFXTGVdf/Correct-Halloween.png")
        }
        else {
            embed.setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
        }

        var button = new disbut.MessageButton()
            .setLabel("Annulla")
            .setStyle("red")
            .setID("annullaChiusura")

        message.channel.send({
            component: button,
            embed: embed
        });

        ticket.daEliminare = true;
        serverstats.ticket[serverstats.ticket.findIndex(x => x.channel == ticket.channel)] = ticket

        setTimeout(function () {
            var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
            var ticket = serverstats.ticket[index];
            if (!ticket) return

            if (ticket.daEliminare) {
                serverstats.ticket = serverstats.ticket.filter(x => x.channel != message.channel.id)
                message.channel.delete()
                    .catch(() => { })
            }
        }, 10000)
    },
};