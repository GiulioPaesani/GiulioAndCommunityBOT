module.exports = {
    name: "tempmute",
    aliases: [],
    description: "**Mutare temporaneamente** un utente dal server, per poi essere smutato",
    info: "Prima di utilizzare questo codice è necessario installare oltre alla libreria mysql per il database (`npm i mysql`) anche quella di ms (`npm i ms`). È necessario appunto anche creare un database per segnare il tutto, in questo modo: `CREATE TABLE serverstats(tempmute LONGTEXT)`",
    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ",
    code: `
const mysql = require("mysql")
const ms = require("ms")
var con = mysql.createPool({ //Connessione database Heroku
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'username',
    password: "password",
    database: 'database',
})
client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        var tempmute = JSON.parse(result[0].tempmute)
        if (message.content.startsWith("!tempmute")) {
            if (!message.member.hasPermission("MUTE_MEMBERS")) {
                message.channel.send("Non hai il permesso");
                return
            }
            var utente = message.mentions.members.first();
            if (!utente) {
                message.channel.send("Utente non valido");
                return
            }
            var ruolo = message.guild.roles.cache.find(role => role.name == "Muted");
            if (!ruolo) {
                ruolo = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        position: 1
                    }
                })
            }
            ruolo = message.guild.roles.cache.find(role => role.name == "Muted");
            message.guild.channels.cache.forEach((canale) => {
                canale.updateOverwrite(ruolo, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                })
            })
            if (tempmute.hasOwnProperty(utente.user.id) || utente.roles.cache.has(ruolo)) {
                message.channel.send("Questo utente è gia mutato")
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
                message.channel.send("Non puoi mutare questo utente")
                return
            }
            utente.roles.add(ruolo)
            tempmute[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }
            message.channel.send(utente.toString() + " è stato mutatoTime: " + ms(time, { long: true }) + "Reason: " + reason)
            con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "'")
        }
    })
})
setInterval(function () {
    con.query("SELECT * FROM serverstats", (err, result) => {
        var tempmute = JSON.parse(result[0].tempmute)
        var tempban = JSON.parse(result[0].tempban)
        for (var i = 0; i < Object.keys(tempmute).length; i++) {
            tempmute[Object.keys(tempmute)[i]].time = tempmute[Object.keys(tempmute)[i]].time - 5;
            if (tempmute[Object.keys(tempmute)[i]].time <= 0) {
                var server = client.guilds.cache.get("idServer") //<--- INSERIRE ID DEL SERVER
                try {
                    var utente = server.members.cache.find(x => x.id = Object.keys(tempmute)[i]);
                    var ruolo = server.roles.cache.find(role => role.name == "Muted");
                    utente.roles.remove(ruolo)
                    delete tempmute[Object.keys(tempmute)[i]]
                }
                catch {
                    delete tempmute[Object.keys(tempmute)[i]]
                }
            }
        }
        con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "'");
    })
}, 5000)
        `
};
