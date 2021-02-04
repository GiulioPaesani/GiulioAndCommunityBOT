if (message.content == "!comando") {
    message.channel.send("Messaggio")
        .then(function (message) {
            message.react("👎"); //Aggiungere o togliere tutte le reazioni che si vogliono
            message.react('🍎');
            message.react('🍊');
            message.react('🍇');
        })
}