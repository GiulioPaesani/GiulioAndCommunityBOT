const Discord = require("discord.js");

module.exports = {
    name: "lockdown",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        let ruolo = message.guild.roles.cache.find(r => r.name === "@everyone");
        if (!lockdown) {
            let embed = new Discord.MessageEmbed()
                .setTitle("LOCKDOWN ATTIVATO")
                .setColor("#ED1C24")
                .setDescription("È appena stato attivato il **sistema di lockdown**\n\nTutti gli utenti con livello inferiore a 5 non vedranno piu nessun canale fino alla disattivazione di questo sistema")
            message.channel.send(embed)
            lockdown = true;
            ruolo.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "USE_VAD"])

            var canale = client.channels.cache.get("869975206310064179");
            canale.updateOverwrite(ruolo, {
                VIEW_CHANNEL: true,
            })

            if (message.channel.id == "869975177935593483") return
            var canale = client.channels.cache.get("869975177935593483");
            canale.send(embed);
        }
        else {
            let embed = new Discord.MessageEmbed()
                .setTitle("LOCKDOWN DISATTIVATO")
                .setColor("#77B155")
                .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti con livello inferiore a 5 possono continuare a partecipare nel server")
            message.channel.send(embed)
            ruolo.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD"])
            lockdown = false;

            var canale = client.channels.cache.get("869975206310064179");
            canale.updateOverwrite(ruolo, {
                VIEW_CHANNEL: false,
            })

            if (message.channel.id == "869975177935593483") return
            var canale = client.channels.cache.get("869975177935593483");
            canale.send(embed);
        }
    },
};