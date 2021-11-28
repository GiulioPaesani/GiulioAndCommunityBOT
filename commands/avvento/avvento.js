module.exports = {
    name: "avvento",
    aliases: ["ricompense"],
    onlyStaff: true,
    availableOnDM: false,
    description: "Visualizzare le ricompense ottenute da ogni utente",
    syntax: "!avvento [user]",
    category: "",
    channelsGranted: [],
    async execute(message, args, client, property) {
        //? var day = new Date().getDate()
        //? var month = new Date().getMonth()
        var day = 24
        var month = 11

        if (month == 11 || (month == 0 && day <= 6)) {

        }
        else {
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
                .setDescription("`!avvento [user]`")
                .setThumbnail('https://i.postimg.cc/zB4j8xVZ/Error.png');

            message.channel.send(embed).then((msg) => {
                message.delete({ timeout: 20000 }).catch(() => { });
                msg.delete({ timeout: 20000 }).catch(() => { });
            });
            return
        }

        var avvento = serverstats.avvento[utente.id]
        if (!avvento) {
            var embed = new Discord.MessageEmbed()
                .setTitle(":christmas_tree: Avvento della community :christmas_tree:")
                .setColor("#ED1C24")
                .setDescription(`Ricompense riscattate da ${utente.toString()}`)
                .addField(`<:closegift:910604692013342720> Avvento non disponibile`, "_Questo utente non ha mai partecipato all'avvento_")

            message.channel.send(embed)
            return
        }

        var numDaRiscattare = 0;

        for (var i = 1; i <= 25; i++) {
            if (month != 11 || i <= day) {
                if (!avvento[i]) {
                    numDaRiscattare++
                }
            }
        }

        var text = ""

        for (var i = 1; i <= 10; i++) {
            text += `**${i}** Dicembre - `

            if (month != 11 || day >= i) {
                if (!avvento[i]) {
                    text += `<:closegift:910604692013342720> Disponibile\r`
                }
                else {
                    text += `<:opengift:914090204715966484> Riscattata\r`
                }
            }
            else {
                text += `<:unlockedgift:914089653592809482> Non disponibile\r`
            }

            if (i == 3)
                text += avvento[3] ? `From: ${new Date(avvento.boost2).getDate()}/${new Date(avvento.boost2).getMonth() + 1} ${new Date(avvento.boost2).getMinutes()}:${new Date(avvento.boost2).getHours()} To: ${new Date(avvento.boost2 + 43200000).getDate()}/${new Date(avvento.boost2 + 43200000).getMonth() + 1} ${new Date(avvento.boost2 + 43200000).getMinutes()}:${new Date(avvento.boost2 + 43200000).getHours()}\r` : ""
            if (i == 10)
                text += avvento.regaloFatto ? `_Ricompensa usata_\r` : `_Ricompensa non usata_\r`
        }

        var text2 = ""

        for (var i = 11; i <= 20; i++) {
            text2 += `**${i}** Dicembre - `

            if (month != 11 || day >= i) {
                if (!avvento[i]) {
                    text2 += `<:closegift:910604692013342720> Disponibile\r`
                }
                else {
                    text2 += `<:opengift:914090204715966484> Riscattata\r`
                }
            }
            else {
                text2 += `<:unlockedgift:914089653592809482> Non disponibile\r`
            }
        }

        var text3 = ""

        for (var i = 21; i <= 25; i++) {
            text3 += `**${i}** Dicembre - `

            if (month != 11 || day >= i) {
                if (!avvento[i]) {
                    text3 += `<:closegift:910604692013342720> Disponibile\r`
                }
                else {
                    text3 += `<:opengift:914090204715966484> Riscattata\r`
                }
            }
            else {
                text3 += `<:unlockedgift:914089653592809482> Non disponibile\r`
            }

            if (i == 21)
                text += avvento[3] ? `From: ${new Date(avvento.boost3).getDate()}/${new Date(avvento.boost3).getMonth() + 1} ${new Date(avvento.boost3).getMinutes()}:${new Date(avvento.boost3).getHours()} To: ${new Date(avvento.boost3 + 43200000).getDate()}/${new Date(avvento.boost3 + 43200000).getMonth() + 1} ${new Date(avvento.boost3 + 43200000).getMinutes()}:${new Date(avvento.boost3 + 43200000).getHours()}\r` : ""
            if (i == 23)
                text3 += avvento.ladroFatto ? `_Ricompensa usata_\r` : `_Ricompensa non usata_\r`
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":christmas_tree: Avvento della community :christmas_tree:")
            .setColor("#ED1C24")
            .setDescription(`Ricompense riscattate da ${utente.toString()}`)
            .addField(`<:closegift:910604692013342720> ${numDaRiscattare} ${numDaRiscattare == 1 ? "ricompensa" : "ricompense"} da riscattare`, text)
            .addField("\u200b", text2)
            .addField("\u200b", text3)

        message.channel.send(embed)

    },
};
