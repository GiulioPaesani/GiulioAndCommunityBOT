const Discord = require("discord.js");
const Parser = require('expr-eval').Parser;

module.exports = {
    name: "message",
    async execute(message) {
        if (message.channel.id != config.idCanaliServer.counting) return
        if (message.author.bot) return

        trovata = getParolaccia(message.content)[0];
        if (trovata && !utenteMod(message.member)) return

        database = await getDatabase()
        await database.collection("serverstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var serverstats = result[0];

            database.collection("userstats").find().toArray(function (err, result) {
                if (err) return codeError(err);
                var userstatsList = result;

                if (message.content == "cos") return

                try {
                    var numero = Parser.evaluate(message.content); //Get numero scritto o risultato espressione
                }
                catch { return }

                var userstats = userstatsList.find(x => x.id == message.author.id);
                if (!userstats) return

                if (message.author.id == serverstats.ultimoUtente) { //Se giocato lo stesso utente piu volte
                    var titleRandom = ["MA SAPETE COME SI GIOCA?", "MA È COSÌ DIFFICILE QUESTO GIOCO?", "NOOOO, PERCHÈ..."]
                    var embed = new Discord.MessageEmbed()
                        .setColor("#EB3140")
                        .setDescription("Ogni utente può scrivere un solo numero alla volta")

                    embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    message.channel.send(embed)
                    message.channel.send("0")
                        .then(msg => {
                            msg.react("🟢")
                        })

                    userstats.incorrect = userstats.incorrect + 1;

                    serverstats.numero = 0;
                    serverstats.ultimoUtente = "NessunUtente";

                    message.react("🔴");
                }
                else if (numero - 1 != serverstats.numero) { //Numero sbagliato
                    var embed = new Discord.MessageEmbed()
                        .setColor("#EB3140")
                        .setDescription("Numero errato, dovevi inserire `" + (serverstats.numero + 1) + "`")

                    if (serverstats.numero == 0) {
                        var titleRandom = ["RIUSCIAMO A COMINCIARE ALMENO?", "DAI... ALMENO ARRIVIAMO A 10", "NON SO SE LO SAI MA IL PRIMO NUMERO È 1", `SAD FOR YOU`, `MA SIETE SCEMI?`, "QUANTO HAI IN MATEMATICA?", "QUALCUNO QUI NON SA CONTARE"]
                        embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    }
                    else if (serverstats.numero <= 10) {
                        var titleRandom = [`FORTUNA CHE ERAVAMO SOLO A ${serverstats.numero}`, `SAD FOR YOU`, "MEGLIO SE TORNATE A PROGRAMMARE", `MA SIETE SCEMI?`, "QUANTO HAI IN MATEMATICA?", `MA SIETE SICURI DI SAPER CONTARE?`, "QUALCUNO QUI NON SA CONTARE"]
                        embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    }
                    else if (serverstats.numero <= 30) {
                        var titleRandom = [`MA SIETE SICURI DI SAPER CONTARE?`, `SAD FOR YOU`, "MEGLIO SE TORNATE A PROGRAMMARE", `MA SIETE SCEMI?`, "QUANTO HAI IN MATEMATICA?", "QUALCUNO QUI NON SA CONTARE", "SIETE DELLE CAPRE"]
                        embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    }
                    else if (serverstats.numero <= 50) {
                        var titleRandom = ["NOOOO, PERCHÈ...", "MEGLIO SE TORNATE A PROGRAMMARE", `MA SIETE SCEMI?`, "QUANTO HAI IN MATEMATICA?", "QUALCUNO QUI NON SA CONTARE", `SAD FOR YOU`, "PROPRIO ORA DOVEVATE SBAGLIARE?", "DAIII, STAVAMO FACENDO IL RECORD", message.member.user.username + " HAI ROVINATO I SOGNI DI TUTTI"]
                        embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    }
                    else {
                        var titleRandom = ["IMMAGINO AVRETE 5 IN MATEMATICA, GIUSTO?", `MA SIETE SCEMI?`, "MEGLIO SE TORNATE A PROGRAMMARE", "QUANTO HAI IN MATEMATICA?", "MEGLIO SE TORNATE A PROGRAMMARE", "QUALCUNO QUI NON SA CONTARE", "SIETE DELLE CAPRE", `SAD FOR YOU`]
                        embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    }
                    message.channel.send(embed)
                    message.channel.send("0")
                        .then(msg => {
                            msg.react("🟢")
                        })

                    userstats.incorrect = userstats.incorrect + 1;

                    serverstats.numero = 0;
                    serverstats.ultimoUtente = "NessunUtente";

                    message.react("🔴");
                }
                else { //Numero corretto
                    numero >= serverstats.bestScore ? message.react("🔵") : message.react("🟢")
                    numero >= serverstats.bestScore ? serverstats.timeBestScore = new Date().getTime().toString() : serverstats.timeBestScore;

                    serverstats.numero = serverstats.numero + 1;
                    serverstats.ultimoUtente = message.author.id
                    serverstats.bestScore = numero > serverstats.bestScore ? serverstats.bestScore = numero : serverstats.bestScore

                    userstats.username = message.member.user.tag;
                    userstats.lastScore = numero;
                    userstats.timeBestScore = numero > userstats.bestScore ? new Date().getTime() : userstats.timeBestScore;
                    userstats.timeLastScore = new Date().getTime();
                    userstats.bestScore = numero > userstats.bestScore ? userstats.bestScore = numero : userstats.bestScore;
                    userstats.correct = userstats.correct + 1;

                }

                database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
                database.collection("serverstats").updateOne({}, { $set: serverstats });
            })
        })
        await database.close()
    },
};