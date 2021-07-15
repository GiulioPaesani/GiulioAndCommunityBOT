module.exports = {
    name: "nomecanale",
    aliases: ["cambiarenome"],
    description: "**Modificare** il nome di un canale",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        //Cambiare il canale del comando
        message.channel.setName("nome modificato")
        //Cambiare un canale specifico
        var canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.setName("nome modificato")
    }
})`
};
