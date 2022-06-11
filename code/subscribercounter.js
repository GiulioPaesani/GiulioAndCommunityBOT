module.exports = {
    name: "Subscriber counter",
    aliases: ["subscribercounter", "counteriscritti"],
    description: "Creare un **canale** con il numero di iscritti in un canale YouTube",
    category: "utility",
    id: "1641212255",
    link: "https://www.toptal.com/developers/hastebin/pizidovaci.js",
    info: "È necessario creare un canale testuale o vocale dove il bot andrà a settare il numero di membri nel server. Prima di utilizzare il comando è necessario installare la libraria yt-channel-info (scrivi nel terminal `npm i yt-channel-info`)",
    code: `
const ytch = require("yt-channel-info")
setInterval(function () {
    const canale = client.channels.cache.get("idCanaleCounter")
    ytch.getChannelInfo("idCanaleYoutube")
        .then(response => {
            canale.setName(\`🧑Subscribers: \${response.subscriberCount}\`)
        })
}, 1000 * 60 * 5)`
};
