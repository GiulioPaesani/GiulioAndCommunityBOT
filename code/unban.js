module.exports = {
    name: "Unban",
    aliases: ["sbannare"],
    description: "**Sbannare** un utente dal server",
    category: "moderation",
    id: "1641211144",
    link: "https://www.toptal.com/developers/hastebin/paxixehiti.js",
    info: "",
    video: "",
    code: `
client.on("messageCreate", async message => {
    if (message.content.startsWith("!unban")) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }

        let args = message.content.split(/\\s+/);
        let idUtente = args[1]

        if (!idUtente) {
            return message.channel.send("Non hai scritto l'id di nessun utente");
        }

        message.guild.members.unban(idUtente)
            .then(() => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Utente sbannato")
                    .setDescription("Questo utente è stato sbannato")

                message.channel.send({ embeds: [embed] })
            })
            .catch(() => { message.channel.send("Utente non valido o non bannato") })
    }
})`
};
