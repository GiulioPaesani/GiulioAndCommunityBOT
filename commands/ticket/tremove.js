const Discord = require("discord.js");

module.exports = {
    name: "tremove",
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
                    .setDescription("Non puoi utilizzare il comando `!tremove` in questo canale")

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
                    .setDescription("Non puoi eseguire il comando `!tremove` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
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
                warming(message, "Questo utente è già rimosso", "Questo utente non ha già accesso a questo ticket")
                return
            }

            if (utenteMod(utente)) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi rimove questo utente dal ticket")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            message.channel.updateOverwrite(utente, {
                VIEW_CHANNEL: false
            })

            correct(message, "Utente rimosso", `${utente.toString()} è stato rimosso a questo ticket`)
        })
    },
};