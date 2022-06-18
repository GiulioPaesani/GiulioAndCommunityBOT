module.exports = {
    name: "Nome canale",
    aliases: ["nomecanale", "cambiarenome"],
    description: "**Modificare** il nome di un canale",
    category: "manage",
    id: "1639466183",
    link: "https://www.toptal.com/developers/hastebin/yuwazapowi.csharp",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Cambiare il canale del comando
        message.channel.setName("nome modificato")

        //Cambiare un canale specifico
        const canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.setName("nome modificato")
    }
})`
};
