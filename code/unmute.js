module.exports = {
    name: "Unmute",
    aliases: ["smutare"],
    description: "**Smutare** un utente nel server",
    category: "moderation",
    id: "1641211896",
    link: "https://www.toptal.com/developers/hastebin/ihizusebab.js",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!unmute")) {
        let utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }

        utente.roles.remove("idRuolo")

        let embed = new Discord.MessageEmbed()
            .setTitle(\`\${utente.user.username} smutato\`)
            .setDescription(\`Utente smutato da \${message.author.toString()}\`)

        message.channel.send({ embeds: [embed] })
    }
})`
};
