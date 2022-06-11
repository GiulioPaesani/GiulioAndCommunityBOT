module.exports = {
    name: "Warn",
    aliases: ["warnare"],
    description: "**Warnare** un utente nel server",
    category: "moderation",
    id: "1654678224",
    link: "https://www.toptal.com/developers/hastebin/ujulacuziz.js",
    info: "Questo è un sistema di warn molto base senza l'utilizzo di database. Ad ogni warn l'utente ottiene un ruolo, e al terzo warn verrà bannato, è quindi necessario creare i ruoli e settarli nel codice. È possibile ovviamente modificare e personalizzare questo sistema con quello che si vuole",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!warn")) {
        let utente = message.mentions.members.first();
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        let reason = message.content.split(/ +/).slice(2).join(" ");
        if (!reason) {
            return message.channel.send('Non hai specificato la motivazione del warn');
        }

        if (utente.roles.cache.has("idRuoloWarn1")) {
            utente.roles.remove("idRuoloWarn1");
            utente.roles.add("idRuoloWarn2");

            let embed = new Discord.MessageEmbed()
                .setTitle(\`\${utente.user.username} warnato\`)
                .setDescription(\`Utente warnato da \${message.author.toString()} per "**\${reason}**"\\nUn altro warn e l'utente verrà bannato\`)
            message.channel.send({ embeds: [embed] })
        }
        else if (utente.roles.cache.has("idRuoloWarn2")) {
            utente.roles.remove("idRuoloWarn2");
            utente.ban()

            let embed = new Discord.MessageEmbed()
                .setTitle(\`\${utente.user.username} warnato\`)
                .setDescription(\`Utente warnato da \${message.author.toString()} per "**\${reason}**"\\nL'utente è stato bannato poichè ha raggiunto i 3 warn\`)
            message.channel.send({ embeds: [embed] })
        }
        else {
            utente.roles.add("idRuoloWarn1");

            let embed = new Discord.MessageEmbed()
                .setTitle(\`\${utente.user.username} warnato\`)
                .setDescription(\`Utente warnato da \${message.author.toString()} per "**\${reason}**"\\nAltri 2 warn e l'utente verrà bannato\`)
            message.channel.send({ embeds: [embed] })
        }
    }
})`
};
