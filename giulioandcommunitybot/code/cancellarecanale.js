module.exports = {
    name: "Cancellare canale",
    aliases: ["cancellarecanale", "deletecanale", "deletechannel"],
    description: "**Cancellare** un canale",
    category: "manage",
    id: "1639466121",
    link: "https://www.toptal.com/developers/hastebin/dufivarepa.go",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Cancellare il canale del comando
        message.channel.delete();
        //Cancellare un canale specifico
        const canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.delete();
    }
})`
};
