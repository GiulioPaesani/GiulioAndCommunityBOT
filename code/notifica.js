module.exports = {
    name: "notifica",
    aliases: [],
    description: "Far inviare al bot un messaggio a una determinata **ora** tutti i giorni",
    info: "",
    video: "https://youtu.be/SN8b92REkII?t=977",
    code: `
//Mettere tutto ciò fuori da tutto, quindi anche fuori da eventuali client.on("message") 
setInterval(function () {
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();
    if (hour == "18" && minutes == "32") { //Settare l'ora che si vuole, in questo momento viene mandato un messaggio in un canale tutti i giorni alle 18:32
        client.channels.cache.get("idCanale").send("Ciao!");
    }
}, 1000 * 60)`
};
