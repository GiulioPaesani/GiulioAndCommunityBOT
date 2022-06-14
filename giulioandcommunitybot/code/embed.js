module.exports = {
    name: "Embed",
    aliases: [],
    description: "Come realizzare un messaggio **embed** perfetto in tutti i suoi parametri",
    info: "Tutte le proprierà che possiamo settare a un embed sono opzionali, quindi non è necessario aggiungerle tutte ma solo quelle necessarie al vostro comando",
    category: "utility",
    id: "1639466150",
    link: "https://www.toptal.com/developers/hastebin/ihihebosas.js",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        const embed = new Discord.MessageEmbed()
            .setTitle("Titolo") //Titolo
            .setColor("#34a42d") // Colore principale
            .setURL("UrlTitolo") //Link sul titolo
            .setAuthor("Autore") /*OPPURE*/.setAuthor("Autore", "LinkImmagine") //Autore
            .setDescription("Descrizione") //Descrizione
            .setThumbnail("UrlCopertina") //Copertina
            //Aggiungere elementi
            .addField("Titolo", "Contenuto", true) //QUI TUTTI I PARAMETRI SONO OBBLIGATORI - True o false = se questo elemento deve essere in linea con gli altri
            .setImage("LinkImmagine") //Immagine
            .setFooter({text: "TestoFooter"}) // Testo piccolino in fondo
            .setTimestamp() //Se mettere o no l'orario di arrivo del messaggio
        message.channel.send({embeds: [embed]})
    }
})`
};
