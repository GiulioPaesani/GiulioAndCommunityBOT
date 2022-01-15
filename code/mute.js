module.exports = {
    name: "Mute",
    aliases: ["mutare"],
    description: "**Mutare** un utente nel server",
    category: "moderation",
    id: "1641211641",
    info: "È necessario creare un ruolo che verrà dato all'utente mutato, con cui non avrà il permesso di scrivere in nessun canale",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content.startsWith("!mute")) {
        var utente = message.mentions.members.first();
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        
        utente.roles.add("idRuolo")

        var embed = new Discord.MessageEmbed()
            .setTitle(\`\${utente.user.username} mutato\`)
            .setDescription(\`Utente mutato da \${message.author.toString()}\`)

        message.channel.send(embed)
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!mute")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }

        utente.roles.add("idRuolo")

        var embed = new Discord.MessageEmbed()
            .setTitle(\`\${utente.user.username} mutato\`)
            .setDescription(\`Utente mutato da \${message.author.toString()}\`)

        message.channel.send({ embeds: [embed] })
    }
})`
};
