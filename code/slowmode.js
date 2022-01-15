module.exports = {
    name: "Slowmode",
    aliases: [],
    description: "Impostare una **slowmode** in un canale",
    category: "moderation",
    id: "1639466160",
    info: "Prima di utilizzare il comando è necessario installare la libraria ms (scrivi nel terminal `npm i ms`)",
    video: "",
    v12: `
const ms = require("ms")
client.on("message", message => {
    if (message.content.startsWith("!slowmode")) {
        var time = message.content.split(/\\s+/)[1];
        if (!time) {
            return message.channel.send("Inserire un tempo valido")
        }

        time = ms(time)
        if (!time && time != 0) {
            return message.channel.send("Inserire un tempo valido")
        }

        if (time > 21600000) {
            return message.channel.send("Inserire un tempo non superiore a 6 ore")
        }

        message.channel.setRateLimitPerUser(parseInt(time) / 1000)
        message.channel.send("Slowmode impostata")
    }
})`,
    v13: `
const ms = require("ms")
client.on("messageCreate", message => {
    if (message.content.startsWith("!slowmode")) {
        var time = message.content.split(/\\s+/)[1];
        if (!time) {
            return message.channel.send("Inserire un tempo valido")
        }

        time = ms(time)
        if (!time && time != 0) {
            return message.channel.send("Inserire un tempo valido")
        }

        if (time > 21600000) {
            return message.channel.send("Inserire un tempo non superiore a 6 ore")
        }

        message.channel.setRateLimitPerUser(parseInt(time) / 1000)
        message.channel.send("Slowmode impostata")
    }
})`
};
