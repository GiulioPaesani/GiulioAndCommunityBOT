//Mettere tutto ciò fuori da tutto, quindi anche fuori dal client.on("message") 
setInterval(function () {
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();

    if (hour == "18" && minutes == "32") { //Settare l'ora che si vuole, in questo momento viene mandato un messaggio in un canale tutti i giorni alle 18:32
        client.channels.cache.get("idCanale").send("Ciao!");
    }
}, 1000 * 60)