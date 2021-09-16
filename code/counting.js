module.exports = {
        name: "counting",
        aliases: [],
        description: "Piccolo **giochino** di counting",
        info: "Prima di utilizzare questo codice è necessario installare oltre alla libreria mysql per il database (`npm i mysql`) anche quella di expr-eval (`npm i expr-eval`). È necessario appunto anche creare due database per segnare il tutto, in questo modo: `CREATE TABLE server (numero INT, ultimoUtente VARCHAR(50), bestScore INT)` e anche così: `CREATE TABLE user (id VARCHAR(50), username VARCHAR(50), lastScore INT, bestScore INT, correct INT, incorrect INT)`",
        video: "https://www.youtube.com/watch?v=O-mxqZ6Sfs4",
        code: `
const mysql = require("mysql")
const Parser = require("expr-eval").Parser
var con = mysql.createPool({ //Connessione database Heroku
        host: 'eu-cdbr-west-03.cleardb.net',
        port: 3306,
        user: 'username',
        password: "password",
        database: 'database',
})
var canaleCounting = "canaleCounting" //Settare il canale di counting del vostro server
client.on("message", message => {
        con.query("SELECT * FROM server", (err, result) => {
                if (err) {
                        console.log(err)
                        return
                }
                var server = result[0]
                con.query("SELECT * FROM user", (err, result) => {
                        if (err) {
                                console.log(err)
                                return
                        }
                        var userList = result;
                        if (message.channel == canaleCounting) {
                                try {
                                        var numero = Parser.evaluate(message.content)
                                        var index = userList.findIndex(x => x.id == message.author.id)
                                        if (index < 0) {
                                                var index = userList.length;
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
                                        var user = userList[index];
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
                                        var utente = message.member;
                                }
                                else {
                                        var utente = message.mentions.members.first()
                                }
                                if (!utente) {
                                        message.channel.send("Utente non trovato");
                                        return
                                }
                                var index = userList.findIndex(x => x.id == message.author.id)
                                if (index < 0) {
                                        message.channel.send("Questo utente non ha mai giocato a Counting")
                                        return
                                }
                                var user = userList[index]
                                var leaderboard = userList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
                                var position = leaderboard.findIndex(x => x.id == utente.user.id)
                                var embed = new Discord.MessageEmbed()
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
                                var leaderboardList = userList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
                                var leaderboard = "";
                                for (var i = 0; i < 10; i++) {
                                        if (leaderboardList.length - 1 < i) {
                                                break
                                        }
                                        leaderboard += "**#" + (i + 1) + "** - " + leaderboardList[i].username + " - **" + leaderboardList[i].bestScore + "**
";
                                }
                                var embed = new Discord.MessageEmbed()
                                        .setTitle("COUNTING SERVER STATS")
                                        .setDescription("Tutte le statistiche del server su counting")
                                        .setThumbnail(message.member.guild.iconURL())
                                        .addField("Numero", server.numero, true)
                                        .addField("Ultimo utente", server.ultimoUtente != "NessunUtente" ? server.ultimoUtente : "Nessun utente", true)
                                        .addField("Best score", server.bestScore, true)
                                        .addField("Leaderboard", leaderboard, false)
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
}
        `
};
