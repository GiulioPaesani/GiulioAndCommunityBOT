module.exports = {
    name: "Tempmute",
    aliases: [],
    description: "**Mutare temporaneamente** un utente dal server, per poi essere smutato",
    category: "moderation",
    id: "1639466264",
    info: "Per realizzare questo codice è necessario un **database**, in particolare è stato realizzato con mysql ma è possibile sostituirlo con qualsiasi altro db. Prima di utilizzare il comando è necessario installare la libraria ms (scrivi nel terminal `npm i ms`)",
    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ",
    v12: `
const ms = require('ms');
client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        var tempmute = JSON.parse(result[0].tempmute)
        if (message.content.startsWith("!tempmute")) {
            if (!message.member.hasPermission("MUTE_MEMBERS")) {
                return message.channel.send("Non hai il permesso");
            }
            var utente = message.mentions.members.first();
            if (!utente) {
                return message.channel.send("Utente non valido");   
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
            message.guild.channels.cache.forEach((canale) => {
                canale.updateOverwrite(ruolo, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                })
            })
            if (tempmute.hasOwnProperty(utente.user.id) || utente.roles.cache.has(ruolo)) {
                return message.channel.send("Questo utente è gia mutato")
            }
            var args = message.content.split(/\\s+/);
            var time = args[2];
            if (!time) {
                return message.channel.send("Inserire un tempo")
            }
            time = ms(time);
            if (!time) {
                return message.channel.send("Inserire un tempo valido")
            }
            var reason = args.splice(3).join(" ");
            if (!reason) {
                reason = "Nessun motivo"
            }
            if (utente.hasPermission("MUTE_MEMBERS")) {
                return message.channel.send("Non puoi mutare questo utente")
            }
            utente.roles.add(ruolo)
            tempmute[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }
            var embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} tempmutato\`)
                    .setDescription(\`Utente mutato per \${ms(time, { long: true })}\\rReason: \${reason}\`)

                message.channel.send(embed)
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
                var server = client.guilds.cache.get("idServer") //Settare id server
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
}, 5000)`,
    v13: `
const ms = require('ms');
client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        var tempmute = JSON.parse(result[0].tempmute)
        if (message.content.startsWith("!tempmute")) {
            if (!message.member.permissions.has("MUTE_MEMBERS")) {
                return message.channel.send("Non hai il permesso");
            }
            var utente = message.mentions.members.first();
            if (!utente) {
                return message.channel.send("Utente non valido");   
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
            message.guild.channels.cache.forEach((canale) => {
                canale.permissionOverwrites.edit(ruolo, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                })
            })
            if (tempmute.hasOwnProperty(utente.user.id) || utente.roles.cache.has(ruolo)) {
                return message.channel.send("Questo utente è gia mutato")
            }
            var args = message.content.split(/\\s+/);
            var time = args[2];
            if (!time) {
                return message.channel.send("Inserire un tempo")
            }
            time = ms(time);
            if (!time) {
                return message.channel.send("Inserire un tempo valido")
            }
            var reason = args.splice(3).join(" ");
            if (!reason) {
                reason = "Nessun motivo"
            }
            if (utente.permissions.has("ADMINISTRATOR")) {
                return message.channel.send("Non puoi mutare questo utente")
            }
            utente.roles.add(ruolo)
            tempmute[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }
            var embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} tempmutato\`)
                    .setDescription(\`Utente mutato per \${ms(time, { long: true })}\\rReason: \${reason}\`)

                message.channel.send({embeds: [embed]})
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
                var server = client.guilds.cache.get("idServer") //Settare id server
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
}, 5000)`
};
