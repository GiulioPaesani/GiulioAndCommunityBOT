module.exports = {
    name: "Tempmute",
    aliases: [],
    description: "**Mutare temporaneamente** un utente dal server, per poi essere smutato",
    category: "moderation",
    id: "1639466264",
    link: "https://www.toptal.com/developers/hastebin/ilupakebaq.js",
    info: "Per realizzare questo codice è necessario un **database**, in particolare è stato realizzato con mysql ma è possibile sostituirlo con qualsiasi altro db. Prima di utilizzare il comando è necessario installare la libraria ms (scrivi nel terminal `npm i ms`)",
    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ",
    code: `
const ms = require('ms');
client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        let tempmute = JSON.parse(result[0].tempmute)
        if (message.content.startsWith("!tempmute")) {
            if (!message.member.permissions.has("MUTE_MEMBERS")) {
                return message.channel.send("Non hai il permesso");
            }
            let utente = message.mentions.members.first();
            if (!utente) {
                return message.channel.send("Utente non valido");   
            }
            let ruolo = message.guild.roles.cache.find(role => role.name == "Muted");
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
            let args = message.content.split(/\\s+/);
            let time = args[2];
            if (!time) {
                return message.channel.send("Inserire un tempo")
            }
            time = ms(time);
            if (!time) {
                return message.channel.send("Inserire un tempo valido")
            }
            let reason = args.splice(3).join(" ");
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
            let embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} tempmutato\`)
                    .setDescription(\`Utente mutato per \${ms(time, { long: true })}\\nReason: \${reason}\`)

                message.channel.send({embeds: [embed]})
            con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "'")
        }
    })
})
setInterval(function () {
    con.query("SELECT * FROM serverstats", (err, result) => {
        let tempmute = JSON.parse(result[0].tempmute)
        let tempban = JSON.parse(result[0].tempban)
        for (let i = 0; i < Object.keys(tempmute).length; i++) {
            tempmute[Object.keys(tempmute)[i]].time = tempmute[Object.keys(tempmute)[i]].time - 5;
            if (tempmute[Object.keys(tempmute)[i]].time <= 0) {
                let server = client.guilds.cache.get("idServer") //Settare id server
                try {
                    let utente = server.members.cache.find(x => x.id = Object.keys(tempmute)[i]);
                    let ruolo = server.roles.cache.find(role => role.name == "Muted");
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
