module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "taggaStaff") return

        var index = serverstats.ticket.findIndex(x => x.channel == button.channel.id);
        var ticket = serverstats.ticket[index];

        if (ticket.modTaggati) return

        if (ticket.owner != button.clicker.user.id) return

        if (ticket.type == "Normal") {
            button.channel.send(`Dai venite ad aiutare <@${ticket.owner}> nel suo ticket`)
            button.channel.send(`<@&${config.ruoliStaff.admin}> <@&${config.ruoliStaff.moderatore}> <@&${config.idRuoloAiutante}> <@&${config.idRuoloAiutanteInProva}>`)
                .then(msg => msg.delete({ timeout: 500 }))

            client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                .then(msg => {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Ticket aperto")
                        .setColor("#4b9afa")
                        .setDescription("In questa chat potrai richiedere **supporto privato** allo staff")

                    let button1 = new disbut.MessageButton()
                        .setLabel("Chiudi ticket")
                        .setStyle("red")
                        .setID("chiudiTicket")

                    let row = new disbut.MessageActionRow()
                        .addComponent(button1)

                    msg.edit({
                        component: row,
                        embed: embed
                    })

                    ticket.modTaggati = true;
                    serverstats.ticket[index] = ticket;
                })
        }
        if (ticket.type == "Moderation") {
            button.channel.send(`Dai venite a rispondere a <@${ticket.owner}> nel suo ticket`)
            button.channel.send(`<@&${config.ruoliStaff.admin}> <@&${config.ruoliStaff.moderatore}>`)
                .then(msg => msg.delete({ timeout: 500 }))

            client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                .then(msg => {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Segnalazione aperta")
                        .setColor("#6143CB")
                        .setDescription(`In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione`)

                    let button1 = new disbut.MessageButton()
                        .setLabel("Chiudi ticket")
                        .setStyle("red")
                        .setID("chiudiTicket")

                    let row = new disbut.MessageActionRow()
                        .addComponent(button1)

                    msg.edit({
                        component: row,
                        embed: embed
                    })

                    ticket.modTaggati = true;
                    serverstats.ticket[index] = ticket;
                })
        }
    },
};