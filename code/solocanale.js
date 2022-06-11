module.exports = {
    name: "Solo canale",
    aliases: ["solocanale"],
    description: "Far eseguire un comando/funzione solo in un determinato canale o in tutti i canali tranne alcuni",
    category: "utility",
    id: "1654680917",
    link: "https://www.toptal.com/developers/hastebin/vojuvucubo.less",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    //Comando eseguibile solo in canali specificati
    if (message.content == "!comando") {
        if (!["idCanale1", "idCanale2"].includes(message.channel.id)) { //È possibile inserire tutti i canali che si vogliono
            return message.channel.send("Non puoi eseguire questo comando in questo canale");
        } 

        //COMANDO
    }

    //Comando eseguibile solo in canali che non siano quelli specificati
    if (message.content == "!comando") {
        if (["idCanale1", "idCanale2"].includes(message.channel.id)) { //È possibile inserire tutti i canali che si vogliono
            return message.channel.send("Non puoi eseguire questo comando in questo canale");
        } 

        //COMANDO
    }
})`
};
