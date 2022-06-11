module.exports = {
    name: "Tempban",
    aliases: [],
    description: "**Bannare temporaneamente** un utente dal server, per poi essere sbannato",
    category: "moderation",
    id: "1639466256",
    link: "https://www.toptal.com/developers/hastebin/apilayafov.js",
    info: "Per realizzare questo codice è necessario un **database**, in particolare è stato realizzato con mysql ma è possibile sostituirlo con qualsiasi altro db. Prima di utilizzare il comando è necessario installare la libraria ms (scrivi nel terminal `npm i ms`)",
    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ",
    code: `
const ms = require('ms');
client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        let tempban = JSON.parse(result[0].tempban)
        if (message.content.startsWith("!tempban")) {
            if (!message.member.permissions.has("BAN_MEMBERS")) {
                return message.channel.send("Non hai il permesso");
            }
            let utente = message.mentions.members.first();
            if (!utente) {
                return message.channel.send("Utente non valido");   
            }
            if (tempban.hasOwnProperty(utente.user.id)) {
                return message.channel.send("Questo utente è gia bannato")
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
            if (utente.permissions.has("BAN_MEMBERS")) {
                return message.channel.send("Non puoi bannare questo utente")
            }
            utente.ban({ reason: reason })
            tempban[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }
            let embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} tempbannato\`)
                    .setDescription(\`Utente bannato per \${ms(time, { long: true })}\\nReason: \${reason}\`)

                message.channel.send({embeds: [embed]})
            con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'")
        }
    })
})
setInterval(function () {
    con.query("SELECT * FROM serverstats", (err, result) => {
        let tempban = JSON.parse(result[0].tempban)
        for (let i = 0; i < Object.keys(tempban).length; i++) {
            tempban[Object.keys(tempban)[i]].time = tempban[Object.keys(tempban)[i]].time - 5;
            if (tempban[Object.keys(tempban)[i]].time <= 0) {
                let server = client.guilds.cache.get("idServer") //Settare id server
                server.members.unban(Object.keys(tempban)[i])
                delete tempban[Object.keys(tempban)[i]]
            }
        }
        con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'");
    })
}, 5000)`
};
