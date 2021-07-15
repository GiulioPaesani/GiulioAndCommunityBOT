module.exports = {
    name: "cancellarecanale",
    aliases: ["deletecanale","deletechannel"],
    description: "**Cancellare** un canale",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        //Cancellare il canale del comando
        message.channel.delete();
        //Cancellare un canale specifico
        var canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.delete();
    }
})`
};
