module.exports = {
    name: "say",
    aliases: [],
    description: "Far **scrivere** al bot un qualunque messaggio ",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content.startsWith("!say")) {
        var args = message.content.split(/\\s+/);
        var testo;
        testo = args.slice(1).join(" ");
        if (!testo) {
            message.channel.send("Inserire un messaggio");
            return
        }
        message.delete()
        message.channel.send(testo)
    }
})`
};
