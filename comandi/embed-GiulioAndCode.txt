client.on("message", message => {
    if (message.content == "!comando") {
        const nomeEmbed = new Discord.MessageEmbed()
            .setColor("#34a454") // Colore principale
            .setTitle("Titolo") //Titolo
            .setURL("UrlTitolo") //Link sul titolo
            .setAuthor("Autore") //Autore (nome, link immagine, link sul nome)
            .setDescription("Descrizione") //Descrizione
            .setThumbnail("UrlCopertina") //Copertina
            //Aggiungere elementi
            .addField("Titolo", "Contenuto", true / false) //True o false = se questo elemento deve essere in linea con gli altri
            .setImage("LinkImmagine") //Immagine
            .setFooter("TestoFooter", "UrlImmagineFooter") // Testo piccolino in fondo
            .setTimestamp() //Se mettere o no l'orario di arrivo del messaggio

        message.channel.send(nomeEmbed)
    }
})