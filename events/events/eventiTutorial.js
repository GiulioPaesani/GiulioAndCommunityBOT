const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("eventiTutorial")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":grey_question: Come funzionano gli eventi :grey_question: ")
            .setColor(colors.purple)
            .setDescription(`Gli eventi all'interno del server sono riguardanti alla **programmazione**
Una volta avviato un evento verrà **pubblicato** in <#${settings.idCanaliServer.events}> per poter essere visto da tutti, con tutte le informazioni di tale evento, cosa è necessario consegnare e molte altri dettagli    
`)
            .addFields([
                {
                    name: ":identification_card: Iscrizione",
                    value: `Per iscriversi a un evento è necessario premere sul bottone "**Iscriviti**" nel messaggio, è possibile iscriversi solo se le iscrizioni non sono state **chiuse** (Dopo la data "Scadenza partecipazioni") e quando non si è ancora raggiunto un **limite massimo** di partecipanti (In questo caso fare attenzione ad eventuali membri che si **disiscrivono** se vi vuole partecipare)
Aperto il canale di partecipazione, seguire le **istruzioni** in modo da inviare tutti i file corretti e nella giusta maniera

_Iscriversi solo quando si ha la possibilità di consegnare immediatamente tutto il necessario per l'evento_
`
                },
                {
                    name: ":bar_chart: Votazione",
                    value: `In live sul [canale Twitch](https://twitch.tv/giulioandcode) di Giulio verranno visionati tutti i partecipanti con ciò che hanno consegnato, e gli verrà assegnato un punteggio
Il punteggio è composto dalla somma del **voto della chat** e del **voto di Giulio**. Quest'ultimo resterà **segreto** fino alla fine per poi scoprire il vincitore dell'evento

Nel comando </events:1019153822448365588> è possibile vedere in tempo reale i punteggi assegnati dalla chat nella **classifica provvisoria** e successivamente anche quelli di Giulio nella **classifica definitiva**
`
                },
                {
                    name: ":gift: Premio",
                    value: `Il **vincitore** di un evento riceverà il ruolo <@&${settings.idRuoloEventWinner}>
`
                }
            ])

        interaction.reply({ embeds: [embed], ephemeral: true })
    },
};