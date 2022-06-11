module.exports = {
    name: "Solo ruolo",
    aliases: ["soloruolo"],
    description: "Far eseguire un comando/funzione solo a chi ha uno o più **ruoli**",
    category: "utility",
    id: "1639466244",
    link: "https://www.toptal.com/developers/hastebin/demomiroro.less",
    info: "",
    video: "https://youtu.be/Cr1yobtZd4c?t=14",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        if (!message.member.roles.cache.has("idRuolo")) {
            return message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        } 

        //COMANDO
    }
    if (message.content == "!comando2") {
        if (!message.member.roles.cache.has("idRuolo1") && !message.member.roles.cache.has("idRuolo2") && !message.member.roles.cache.has("idRuolo3")) { //Più permessi
            return message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        }

        //COMANDO
    }
})`
};
