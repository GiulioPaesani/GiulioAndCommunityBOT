module.exports = {
    name: "Menu",
    aliases: ["message menu", "select"],
    description: "Come creare e usare i menu",
    info: "",
    category: "utility",
    id: "1654679034",
    link: "https://www.toptal.com/developers/hastebin/ojilakaget.csharp",
    video: "https://youtu.be/g0_6naSxp6E",
    code: `
//Creare i menu
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Menu unico
        let embed = new Discord.MessageEmbed()
            .setTitle("Embed")
            .setDescription("Seleziona un opzione nel menu")

        let select = new Discord.MessageSelectMenu()
            .setCustomId("idMenu")
            .setPlaceholder("Seleziona un'opziome")
            .setMinValues(1) //Minimo di opzioni che si possono cliccare
            .setMaxValues(1) //Massimo di opzioni che si possono cliccare
            .addOptions([ //Si possono inserire al massimo 25 opzioni
                {
                    label: "Opzione 1",
                    description: "Descrizione opzione numero 1",
                    value: "opzione1"
                },
                {
                    label: "Opzione 2",
                    description: "Descrizione opzione numero 2",
                    value: "opzione2"
                },
                {
                    label: "Opzione 3",
                    description: "Descrizione opzione numero 3",
                    value: "opzione3"
                }
            ])

        let row = new Discord.MessageActionRow() //Per ogni riga si può inserire un solo menu
            .addComponents(select)

        message.channel.send({ embeds: [embed], components: [row] }) //Si possono inserire massimo 5 righe (Es: components: [row1, row2, row3])

    }
})

//Evento di click
client.on("interactionCreate", interaction => {
    if (!interaction.isSelectMenu()) return

    if (interaction.customId == "idMenu") {
        await interaction.deferUpdate()

        switch (interaction.values[0]) {
            case "opzione1": {
                interaction.reply({ content: "Hai cliccato l'opzione1", ephemeral: true }) //Se ephemeral è true il messaggio verrà mostrato solo all'utente che ha cliccato il menu

                //Tutto quello che si vuole (modificare il messaggio, inviare un messaggio, creare un canale...)
            } break
            case "opzione2": {
                //Codice opzione2
            } break
            case "opzione3": {
                //Codice opzione3
            } break
        }
    }
})`
};
