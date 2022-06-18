module.exports = {
        name: "Counting",
        aliases: [],
        description: "Piccolo **giochino** di counting",
        category: "fun",
        id: "1639466143",
        link: "https://www.toptal.com/developers/hastebin/owemuhemeq.js",
        info: "Per realizzare questo codice è necessario un **database**, in particolare è stato realizzato con MYSQL ma è possibile sostituirlo con qualsiasi altro db. Prima di utilizzare il comando è necessario installare la libraria expr-eval (scrivi nel terminal `npm i expr-eval`)",
        video: "https://www.youtube.com/watch?v=O-mxqZ6Sfs4",
        code: `
let canaleCounting = "canaleCounting" //Settare il canale di counting del vostro server
client.on("message", message => {
        con.query("SELECT * FROM server", (err, result) => {
                if (err) {
                        console.log(err)
                        return
                }
                let server = result[0]
                con.query("SELECT * FROM user", (err, result) => {
                        if (err) {
                                console.log(err)
                                return
                        }
                        let userList = result;
                        if (message.channel == canaleCounting) {
                                try {
                                        let numero = Parser.evaluate(message.content)
                                        let index = userList.findIndex(x => x.id == message.author.id)
                                        if (index < 0) {
                                                let index = userList.length;
                                                userList[index] = {
                                                        id: message.author.id,
                                                        username: message.member.user.tag,
                                                        lastScore: 0,
                                                        bestScore: 0,
                                                        correct: 0,
                                                        incorrect: 0
                                                }
                                                con.query("INSERT INTO user VALUES (" + message.author.id + ",'" + message.member.user.tag + "', 0, 0, 0, 0)", (err) => {
                                                        if (err) {
                                                                console.log(err)
                                                                return
                                                        }
                                                })
                                        }
                                        let user = userList[index];
                                        if (message.author.id == server.ultimoUtente) {
                                                message.react("🔴")
                                                message.channel.send("ERRORE - Ogni utente può scrivere un numero alla volta")
                                                user.incorrect = user.incorrect + 1;
                                                server.numero = 0;
                                                server.ultimoUtente = "NessunUtente";
                                                server.bestScore = server.bestScore;
                                        }
                                        else if (numero - 1 != server.numero) {
                                                message.react("🔴")
                                                message.channel.send("ERRORE - Hai scritto un numero sbagliato")
                                                user.incorrect = user.incorrect + 1;
                                                server.numero = 0;
                                                server.ultimoUtente = "NessunUtente";
                                                server.bestScore = server.bestScore;
                                        }
                                        else {
                                                numero >= server.bestScore ? message.react("🔵") : message.react("🟢")
                                                server.numero = server.numero + 1;
                                                server.ultimoUtente = message.author.id;
                                                numero >= server.bestScore ? server.bestScore = numero : server.bestScore = server.bestScore
                                                user.lastScore = numero;
                                                numero >= user.bestScore ? user.bestScore = numero : user.bestScore = user.bestScore;
                                                user.correct = user.correct + 1
                                        }
                                        updateDatabase(user, server)
                                } catch {
                                }
                        }
                        if (message.content.startsWith("!cuser")) {
                                if (message.content == "!cuser") {
                                        let utente = message.member;
                                }
                                else {
                                        let utente = message.mentions.members.first()
                                }
                                if (!utente) {
                                        message.channel.send("Utente non trovato");
                                        return
                                }
                                let index = userList.findIndex(x => x.id == message.author.id)
                                if (index < 0) {
                                        message.channel.send("Questo utente non ha mai giocato a Counting")
                                        return
                                }
                                let user = userList[index]
                                let leaderboard = userList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
                                let position = leaderboard.findIndex(x => x.id == utente.user.id)
                                let embed = new Discord.MessageEmbed()
                                        .setTitle("COUNTING USER STATS")
                                        .setDescription("Tutte le statistiche di questo utente su counting")
                                        .setThumbnail(utente.user.displayAvatarURL())
                                        .addField("Last score", user.lastScore, true)
                                        .addField("Best score", user.bestScore, true)
                                        .addField("Position", position, true)
                                        .addField("Correct", user.correct, true)
                                        .addField("Incorrect", user.incorrect, true)
                                message.channel.send(embed)
                        }
                        if (message.content == "!cserver") {
                                let leaderboardList = userList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
                                let leaderboard = "";
                                for (let i = 0; i < 10; i++) {
                                        if (leaderboardList.length - 1 < i) {
                                                break
                                        }
                                        leaderboard += "**#" + (i + 1) + "** - " + leaderboardList[i].username + " - **" + leaderboardList[i].bestScore + "**\\n";
                                }
                                let embed = new Discord.MessageEmbed()
                                        .setTitle("COUNTING SERVER STATS")
                                        .setDescription("Tutte le statistiche del server su counting")
                                        .setThumbnail(message.member.guild.iconURL())
                                        .addField("Numero", server.numero, true)
                                        .addField("Ultimo utente", server.ultimoUtente != "NessunUtente" ? server.ultimoUtente : "Nessun utente", true)
                                        .addField("Best score", server.bestScore, true)
                                        .addField("Leaderboard", leaderboard)
                                message.channel.send(embed)
                        }
                })
        })
})
function updateDatabase(user, server) {
        con.query("UPDATE server SET numero = " + server.numero + ", ultimoUtente = '" + server.ultimoUtente + "', bestScore = " + server.bestScore, (err) => {
                if (err) {
                        console.log(err);
                        return
                }
        })
        con.query("UPDATE user SET lastScore = " + user.lastScore + ", bestScore = " + user.bestScore + ", correct = " + user.correct + ", incorrect = " + user.incorrect + " WHERE id = " + user.id, (err) => {
                if (err) {
                        console.log(err);
                        return
                }
        })
}`
};
