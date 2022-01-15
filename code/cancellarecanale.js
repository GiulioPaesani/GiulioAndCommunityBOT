module.exports = {
    name: "Cancellare canale",
    aliases: ["cancellarecanale", "deletecanale", "deletechannel"],
    description: "**Cancellare** un canale",
    category: "utility",
    id: "1639466121",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content == "!comando") {
        //Cancellare il canale del comando
        message.channel.delete();
        //Cancellare un canale specifico
        var canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.delete();
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Cancellare il canale del comando
        message.channel.delete();
        //Cancellare un canale specifico
        var canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.delete();
    }
})`
};
