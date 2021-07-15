module.exports = {
    name: "tempban",
    aliases: [],
    description: "**Bannare temporaneamente** un utente dal server, per poi essere sbannato",
    info: "Prima di utilizzare questo codice è necessario installare oltre alla libreria mysql per il database (`npm i mysql`) anche quella di ms (`npm i ms`). È necessario appunto anche creare un database per segnare il tutto, in questo modo: `CREATE TABLE serverstats(tempban LONGTEXT)`",
    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ",
    code: `
const mysql = require("mysql")
const ms = require("ms")
var con = mysql.createPool({ //Connessione database Heroku
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'username',
    password: "password",
    database: 'database'
})
client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        var tempban = JSON.parse(result[0].tempban)
        if (message.content.startsWith("!tempban")) {
            if (!message.member.hasPermission("BAN_MEMBERS")) {
                message.channel.send("Non hai il permesso");
                return
            }
            var utente = message.mentions.members.first();
            if (!utente) {
                message.channel.send("Utente non valido");
                return
            }
            if (tempban.hasOwnProperty(utente.user.id)) {
                message.channel.send("Questo utente è già bannato")
                return
            }
            var args = message.content.split(/s+/);
            var time = args[2];
            if (!time) {
                message.channel.send("Inserire un tempo")
                return
            }
            time = ms(time);
            if (!time) {
                message.channel.send("Inserire un tempo valido")
                return
            }
            var reason = args.splice(3).join(" ");
            if (!reason) {
                reason = "Nessun motivo"
            }
            if (utente.hasPermission("ADMINISTRATOR")) {
                message.channel.send("Non puoi bannare questo utente")
                return
            }
            utente.ban({ reason: reason })
            tempban[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }
            message.channel.send(utente.toString() + " è stato bannatoTime: " + ms(time, { long: true }) + "Reason: " + reason)
            con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'")
        }
    })
})
setInterval(function () {
    con.query("SELECT * FROM serverstats", (err, result) => {
        var tempban = JSON.parse(result[0].tempban)
        for (var i = 0; i < Object.keys(tempban).length; i++) {
            tempban[Object.keys(tempban)[i]].time = tempban[Object.keys(tempban)[i]].time - 5;
            if (tempban[Object.keys(tempban)[i]].time <= 0) {
                var server = client.guilds.cache.get("idServer") //<--- INSERIRE ID DEL SERVER
                server.members.unban(Object.keys(tempban)[i])
                delete tempban[Object.keys(tempban)[i]]
            }
        }
        con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'");
    })
}, 5000)
        `
};
