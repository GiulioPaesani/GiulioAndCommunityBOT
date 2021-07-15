module.exports = {
    name: "soloruolo",
    aliases: [],
    description: "Far eseguire un comando/funzione solo a chi ha uno o più **ruoli**",
    info: "",
    video: "https://youtu.be/Cr1yobtZd4c?t=14",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        if (message.member.roles.cache.has("idRuolo")) {
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai il ruolo");
        }
    }
    if (message.content == "!comando2") {
        if (message.member.roles.cache.has("idRuolo") || message.member.roles.cache.has("idRuolo2") || message.member.roles.cache.has("idRuolo3")) { //Più ruoli
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai i ruoli");
        }
    }
})`
};
