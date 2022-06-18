module.exports = {
    name: "Solo permesso",
    aliases: ["solopermesso", "permesso"],
    description: "Far eseguire un comando/funzione solo a chi ha uno o più **permessi**",
    category: "utility",
    id: "1639466238",
    link: "https://www.toptal.com/developers/hastebin/alusuyigoh.less",
    info: "Puoi trovare l'elenco di tutti i permessi [qui](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        } 

        //COMANDO
    }
    if (message.content == "!comando2") {
        if (!message.member.permissions.has('BAN_MEMBERS') && !message.member.permissions.has('KICK_MEMBERS') && !message.member.permissions.has('ADMINISTRATOR')) { //Più permessi
            return message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        }

        //COMANDO
    }
})`
};
