module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return

        if (!serverstats) return
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) return

        var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
        var ticket = serverstats.ticket[index];

        if (ticket.modTaggati) return

        var ruolo = message.mentions.roles.first()
        var utente = message.mentions.members.first()
        if ((ruolo && Object.values(config.ruoliStaff).includes(ruolo.id)) || utenteMod(message.member) || (utente && utenteMod(utente)) || message.member.roles.cache.has(config.idRuoloAiutante) || message.member.roles.cache.has(config.idRuoloAiutanteInProva)) {
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
    },
};