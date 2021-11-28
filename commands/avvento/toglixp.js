module.exports = {
    name: "toglixp",
    aliases: ["rubaxp", "ruba"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Ruba 500 punti esperienza per l'avvento",
    syntax: "!toglixp [user]",
    category: "",
    channelsGranted: [],
    async execute(message, args, client, property) {
        //? var day = new Date().getDate()
        //? var month = new Date().getMonth()
        var day = 30
        var month = 11

        if (month == 11 || (month == 0 && day <= 6)) {

        }
        else {
            return
        }

        if (month == 11 && day < 25) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Comando non esistente")
                .setColor("#FF931E")
                .setDescription(`Il comando \`!toglixp\` non esiste`)
                .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")

            if (!utenteMod(message.author))
                message.channel.send(embed).then((msg) => {
                    message.delete({ timeout: 20000 }).catch(() => { });
                    msg.delete({ timeout: 20000 }).catch(() => { });
                });
        }

        var avvento = serverstats.avvento[message.author.id]
        if (!avvento) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Ricompensa non ancora riscattata")
                .setColor(`#8F8F8F`)
                .setDescription("Vai in <#907340145383047168> per riscattare questa **super ricompensa** del giorno 23")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        if (!avvento[23]) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Ricompensa non ancora riscattata")
                .setColor(`#8F8F8F`)
                .setDescription("Vai in <#907340145383047168> per riscattare questa **super ricompensa** del giorno 23")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        if (avvento.ladroFatto) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Ricompensa già usata")
                .setColor(`#8F8F8F`)
                .setDescription("Hai già tolto **500xp** a un utente, puoi farlo solo una volta")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
        }

        if (!utente) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente non trovato")
                .setColor(`#ED1C24`)
                .setDescription("`!toglixp [user]`")
                .setThumbnail('https://i.postimg.cc/zB4j8xVZ/Error.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        if (utente.id == message.author.id) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Non a te stesso")
                .setColor(`#8F8F8F`)
                .setDescription("Non puoi togliere questi punti esperienza a te stesso, mi spiace...")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("Togli 500xp")
            .setColor("#fcba03")
            .setDescription(`Togli **500 punti esperienza** a ${utente.toString()}
_Conferma l'azione con il bottone qua sotto_`)
            .setThumbnail("https://i.postimg.cc/1XtKR0M0/Senza-titolo-1.jpg")
            .setFooter("Questi punti NON ti verranno riaggiunti a dopo")

        var button1 = new disbut.MessageButton()
            .setLabel("Annulla")
            .setStyle("red")
            .setID(`annullaRegalo,${message.author.id}`)

        var button2 = new disbut.MessageButton()
            .setLabel("Conferma saccheggio")
            .setStyle("green")
            .setID(`confermaLadro,${message.author.id},${utente.id}`)

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        message.channel.send(embed, row)

    },
};
