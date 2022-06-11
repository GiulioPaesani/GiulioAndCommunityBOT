module.exports = {
    name: "Button",
    aliases: ["bottoni", "message button"],
    description: "Come creare e usare i bottoni",
    info: "",
    category: "utility",
    id: "1654678484",
    link: "https://www.toptal.com/developers/hastebin/gawurociko.js",
    video: "https://youtu.be/g0_6naSxp6E",
    code: `
//Creare i bottoni
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Bottone unico
        let embed1 = new Discord.MessageEmbed()
            .setTitle("Embed")
            .setDescription("Premi i bottoni")

        let button1 = new Discord.MessageButton()
            .setLabel("Testo bottone")
            .setCustomId("idBottone1")
            .setStyle("PRIMARY") //Oppure "DANGER", "SECONDARY", "SUCCESS"

        let row1 = new Discord.MessageActionRow()
            .addComponents(button1)

        message.channel.send({ embeds: [embed1], components: [row1] })

        //Più bottoni
        let embed2 = new Discord.MessageEmbed()
            .setTitle("Embed")
            .setDescription("Primi i bottoni")

        let button2 = new Discord.MessageButton()
            .setLabel("Testo bottone")
            .setCustomId("idBottone2")
            .setStyle("PRIMARY")

        let button3 = new Discord.MessageButton()
            .setLabel("Testo bottone")
            .setCustomId("idBottone3")
            .setStyle("PRIMARY")

        let row2 = new Discord.MessageActionRow() //Massimo 5 bottoni per riga
            .addComponents(button2)
            .addComponents(button3)

        message.channel.send({ embeds: [embed2], components: [row2] }) //Si possono inserire massimo 5 righe (Es: components: [row1, row2, row3])
    }
})

//Evento di click
client.on("interactionCreate", interaction => {
    if (!interaction.isButton()) return

    if (interaction.customId == "idBottone1") {
        interaction.reply({ content: "Hai cliccato il bottone", ephemeral: true }) //Se ephemeral è true il messaggio verrà mostrato solo all'utente che ha cliccato il bottone

        interaction.member.roles.add("idRuolo") //Aggiungere un ruolo all'utente

        //Tutto quello che si vuole
    }
})`
};
