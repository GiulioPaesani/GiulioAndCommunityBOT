module.exports = {
    name: "Notifica",
    aliases: [],
    description: "Far inviare al bot un messaggio a una determinata **ora** tutti i giorni o ogni tot tempo",
    category: "utility",
    id: "1642321321",
    info: "",
    video: "https://youtu.be/SN8b92REkII?t=977",
    v12: `
//Notifica a una determinata ora
setInterval(function () {
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();
    if (hour == "18" && minutes == "32") { //Settare l'ora che si vuole, in questo momento viene mandato un messaggio in un canale tutti i giorni alle 18:32
        client.channels.cache.get("idCanale").send("Ciao!");
    }
}, 1000 * 60)

//Notifica ogni tot tempo
setInterval(function () {
    client.channels.cache.get("idCanale").send("Ciao!");
}, 1000 * 60 * 60 * 2) //Ogni due ore (personalizzabile)`,
    v13: `
//Notifica a una determinata ora
setInterval(function () {
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();
    if (hour == "18" && minutes == "32") { //Settare l'ora che si vuole, in questo momento viene mandato un messaggio in un canale tutti i giorni alle 18:32
        client.channels.cache.get("idCanale").send("Ciao!");
    }
}, 1000 * 60)

//Notifica ogni tot tempo
setInterval(function () {
    client.channels.cache.get("idCanale").send("Ciao!");
}, 1000 * 60 * 60 * 2) //Ogni due ore (personalizzabile)`
};
