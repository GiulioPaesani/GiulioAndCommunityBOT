const moment = require("moment");

module.exports = {
    name: "eastercode",
    aliases: [""],
    onlyStaff: false,
    availableOnDM: true,
    description: "Riscattare un codice dell'evento pasquale",
    syntax: "!eastercode [codice]",
    category: "general",
    channelsGranted: [],
    async execute(message, args, client, property) {
        if (message.channel.type != "DM") {
            message.delete()
            let embed = new Discord.MessageEmbed()
                .setTitle("Disponibile solo in DM")
                .setColor("#919191")
                .setDescription("Utilizza questo comando nei DM del bot in modo da non spoilerare ad altri utenti il codice")

            message.channel.send({ embeds: [embed] })
            return
        }

        var code = args.join(" ");

        if (!code) {
            return botCommandMessage(message, "Error", "Inserire un codice", "Scrivi il codice che vuoi riscattare", property)
        }

        code = code.toUpperCase().trim().split(" ")[0]

        let codes = [
            {
                numSfida: 1,
                code: "G2LK6",
                difficulty: 1
            },
            {
                numSfida: 2,
                code: "VGSMR",
                difficulty: 3
            },
            {
                numSfida: 3,
                code: "NITSI",
                difficulty: 2
            },
            {
                numSfida: 4,
                code: "H4A78",
                difficulty: 1
            },
            {
                numSfida: 5,
                code: "49620",
                difficulty: 3
            },
            {
                numSfida: 6,
                code: "K2SUO",
                difficulty: 2
            },
            {
                numSfida: 7,
                code: "YZ1JJ",
                difficulty: 1
            },
            {
                numSfida: 8,
                code: "63GQC",
                difficulty: 2
            },
            {
                numSfida: 9,
                code: "32176",
                difficulty: 3
            },
            {
                numSfida: 10,
                code: "JUO3M",
                difficulty: 1
            },
            {
                numSfida: 11,
                code: "YLDP5",
                difficulty: 1
            },
            {
                numSfida: 12,
                code: "86427",
                difficulty: 3
            },
            {
                numSfida: 13,
                code: "62J9B",
                difficulty: 2
            },
            {
                numSfida: 14,
                code: "K3Z9F",
                difficulty: 1
            }
        ]

        var data = new Date()

        if (!codes.find(x => x.code == code) || data.getDate() < (10 + codes.find(x => x.code == code).numSfida)) {
            return botCommandMessage(message, "Error", "Codice inesistente", "Questo codice non corrisponde a nessuna sfida", property)
        }

        code = codes.find(x => x.code == code)

        if (serverstats.easter.find(x => x.id == message.author.id)?.codes[code.numSfida]) {
            return botCommandMessage(message, "Warning", "Già riscattato", "Hai già riscattato questo codice. Continua a giocare per scoprirne altri")
        }

        var minutiPassati = Math.floor((data.getTime() - new Date(2022, 03, 10 + code.numSfida, 0, 0).getTime()) / 1000 / 60)

        let embed = new Discord.MessageEmbed()
            .setTitle(`Codice SFIDA ${code.numSfida} riscattato`)
            .setColor("#EF7A98")
            .setDescription(`Hai completato con successo la **sfida ${code.numSfida}**. Scopri i premi che hai vinto`)
            .addField(":gift: Premi vinti", `
+ **${Math.floor((20160 - minutiPassati) / 5 * code.difficulty)} Punti classifica**
+ ${Math.floor((20160 - minutiPassati) / 25 * code.difficulty)} XP
+ ${Math.floor((20160 - minutiPassati) / 40 * code.difficulty)} Coins
`)

        message.channel.send({ embeds: [embed] })
            .catch(() => { })

        if (message.author.id == settings.idGiulio) return

        if (!serverstats.easter.find(x => x.id == message.author.id)) {
            serverstats.easter.push({
                id: message.author.id,
                points: 0,
                codes: {}
            })
        }

        serverstats.easter[serverstats.easter.findIndex(x => x.id == message.author.id)].points += Math.floor((20160 - minutiPassati) / 5 * code.difficulty)
        serverstats.easter[serverstats.easter.findIndex(x => x.id == message.author.id)].codes[code.numSfida] = {
            code: code.code,
            points: Math.floor((20160 - minutiPassati) / 5 * code.difficulty)
        }

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return

        userstats = await addXp(userstats, Math.floor((20160 - minutiPassati) / 25 * code.difficulty), 0, true);
        userstats.money += Math.floor((20160 - minutiPassati) / 40 * code.difficulty)
        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};