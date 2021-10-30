module.exports = {
    name: "tremove",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Canale non concesso")
                .setColor("#F15A24")
                .setDescription("Non puoi utilizzare il comando `!tremove` in questo canale")

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
                .setDescription("Non puoi eseguire il comando `!tremove` in questo canale")

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

        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!tremove [user]`")
            return
        }

        const hasPermissionInChannel = message.channel
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (!hasPermissionInChannel) {
            warning(message, "Questo utente è già rimosso", "Questo utente non ha già accesso a questo ticket")
            return
        }

        if (utenteMod(utente)) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Non hai il permesso")
                .setColor("#9E005D")
                .setDescription("Non puoi rimove questo utente dal ticket")

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
            }

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 7000 })
                    .catch(() => { })
                msg.delete({ timeout: 7000 })
                    .catch(() => { })
            })
            return
        }

        message.channel.updateOverwrite(utente, {
            VIEW_CHANNEL: false
        })

        correct(message, "Utente rimosso", `${utente.toString()} è stato rimosso a questo ticket`)
    },
};