module.exports = {
    name: "solopermesso",
    aliases: ["permesso"],
    description: "Far eseguire un comando/funzione solo a chi ha uno o più **permessi**",
    info: "Puoi trovare l'elenco di tutti i permessi [qui](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        if (message.member.hasPermission('BAN_MEMBERS')) { //Permesso di bannare
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        }
    }
    if (message.content == "!comando2") {
        if (message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('KICK_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) { //Più permessi
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        }
    }
})`
};
