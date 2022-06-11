module.exports = {
    name: "Lockdown",
    aliases: [],
    description: "Attivare/Disattivare sistema di lockdown",
    category: "moderation",
    id: "1641209780",
    link: "https://www.toptal.com/developers/hastebin/xevexeqogo.csharp",
    info: "Per poter attivare correttamente il lockdown è necessario settare in tutti i canali visibili di default a tutti i membri (quindi no ai canali privati) al ruolo @everyone i permessi di \"Visualizzare il canale\" allo stato neutro, quello centrale",
    video: "",
    code: `
let lockdownAttivato = false;
client.on("messageCreate", message => {
    if (message.content == "!lockdown") {
        if (!lockdownAttivato) {
            message.channel.send("Lockdown ATTIVATO!")

            let everyone = message.guild.roles.everyone
            everyone.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_VAD"]) //Scrivere tutti i permessi che di default @everyone deve avere tranne VIEW_CHANNEL

            client.channels.cache.get("idCanale").permissionOverwrites.edit(everyone, { //Canale in cui è presente un messaggio per avvisare del lockdown attivo (facoltativo)
                VIEW_CHANNEL: true,
            })
        }
        else {
            message.channel.send("Lockdown DISATTIVATO!")

            let everyone = message.guild.roles.everyone
            everyone.setPermissions(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_VAD"]) //Scrivere tutti i permessi che di default @everyone

            client.channels.cache.get("idCanale").permissionOverwrites.edit(everyone, { //Canale in cui è presente un messaggio per avvisare del lockdown attivo (facoltativo)
                VIEW_CHANNEL: false,
            })
        }
        lockdownAttivato = !lockdownAttivato
    }
})`
};
