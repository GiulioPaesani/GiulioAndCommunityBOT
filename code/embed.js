module.exports = {
    name: "embed",
    aliases: [],
    description: "Come realizzare un messaggio **embed** perfetto in tutti i suoi parametri",
    info: "Tutte le proprierà che possiamo settare a un embed sono opzionali, quindi non è necessario aggiungerle tutte ma solo quelle necessarie al vostro comando",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        const nomeEmbed = new Discord.MessageEmbed()
            .setTitle("Titolo") //Titolo
            .setColor("#34a42d") // Colore principale
            .setURL("UrlTitolo") //Link sul titolo
            .setAuthor("Autore") /*OPPURE*/.setAuthor("Autore", "LinkImmagine") //Autore
            .setDescription("Descrizione") //Descrizione
            .setThumbnail("UrlCopertina") //Copertina
            //Aggiungere elementi
            .addField("Titolo", "Contenuto", true / false) //QUI TUTTI I PARAMETRI SONO OBBLIGATORI - True o false = se questo elemento deve essere in linea con gli altri
            .setImage("LinkImmagine") //Immagine
            .setFooter("TestoFooter") /*OPPURE*/.setFooter("TestoFooter", "UrlImmagineFooter") // Testo piccolino in fondo
            .setTimestamp() //Se mettere o no l'orario di arrivo del messaggio
        message.channel.send(nomeEmbed)
    }
})`
};
