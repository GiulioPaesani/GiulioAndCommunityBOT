const Discord = require("discord.js");
const { MessageButton } = require('discord-buttons');
const { MessageActionRow } = require('discord-buttons')

module.exports = {
    name: "tclose",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [],
    execute(message, args, client) {
        database.collection("serverstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var serverstats = result[0];

            if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tclose` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }

            var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
            var ticket = serverstats.ticket[index];

            if (!utenteMod(message.member) && message.author.id != ticket.owner && !message.member.roles.cache.has(config.idRuoloAiutante) && !message.member.roles.cache.has(config.idRuoloAiutanteInProva)) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!tclose` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
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
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .setDescription("Questo ticket si cancellerà tra 10 secondi")

            var button = new MessageButton()
                .setLabel("Annulla")
                .setStyle("red")
                .setID("annullaChiusura")

            message.channel.send({
                component: button,
                embed: embed
            });

            ticket.daEliminare = true;
            serverstats.ticket[serverstats.ticket.findIndex(x => x.channel == ticket.channel)] = ticket
            database.collection("serverstats").updateOne({}, { $set: serverstats });

            var idCanale = ticket.channel;
            setTimeout(function () {
                database.collection("serverstats").find().toArray(function (err, result) {
                    if (err) return codeError(err);
                    var serverstats = result[0];

                    var ticket = serverstats.ticket.find(x => x.channel == idCanale);
                    if (!ticket) return

                    if (ticket.daEliminare) {
                        message.channel.delete()
                        serverstats.ticket = serverstats.ticket.filter(x => x.channel != ticket.channel)
                        database.collection("serverstats").updateOne({}, { $set: serverstats });
                    }

                })
            }, 10000)
        })
    },
};