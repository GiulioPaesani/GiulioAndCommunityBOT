module.exports = {
    name: `interactionCreate`,
    async execute(menu) {
        if (!menu.isSelectMenu()) return
        if (!menu.customId.startsWith("ticketSubCategory")) return

        if (isMaintenance(menu.user.id)) return

        if (menu.customId.split(",")[1] != menu.user.id) return menu.deferUpdate()

        menu.deferUpdate()

        if (menu.values[0] == "ticketCategory15" || menu.values[0] == "ticketCategory23" || menu.values[0] == "ticketCategory34") {
            var embed = new Discord.MessageEmbed()
                .setColor("#fcba03")
                .setDescription(`\`Altro...\`
Il ticket è stato **aperto**, ora puoi parlare con lo staff`)

            if (menu.values[0] == "ticketCategory15") {
                embed
                    .setTitle(":robot: Problemi con bot :robot:")
                    .addField(":interrobang: Ricordati...", `
- __Descrivi bene il tuo problema__
Spiega bene cosa c'è che non va già da subito, invia eventuali errori e codice
- __Non chiedere di poter chiedere__
Non dire "posso chiedere aiuto?" ma chiedilo direttamente, in modo da non sprecare tempo, sia per te che per noi
- __Non siamo tuoi schiavi__
Non siamo ne onniscenti ne tuoi schiavi, quindi non pretendere di riuscire a risolvere il problema o di ricevere funzioni e codici complessi o lunghi
- __Cerca sempre di risolvere il problema da solo__
Farsi correggere o mandare codice da altri non è mai un buon strumento per imparare. Cerca sempre di capire cosa sbagli e come non sbagliare più. Insomma non essere stupido
`)
            }
            else if (menu.values[0] == "ticketCategory23") {
                embed
                    .setTitle(":ferris_wheel: Problemi nel server :ferris_wheel:")
                    .addField(":interrobang: Ricordati...", `
- __Descrivi bene il tuo problema__
Spiega bene cosa c'è che non va già da subito
- __Non chiedere di poter chiedere__
Non dire "posso fare una domanda?" ma chiedila direttamente, in modo da non sprecare tempo, sia per te che per noi
- __Non siamo tuoi schiavi__
Non siamo ne onniscenti ne tuoi schiavi, quindi non pretendere di riuscire ad avere una risposta adeguata alle tue aspettative`)
            }
            else {
                embed
                    .setTitle(":eyes: Domande allo staff :eyes:")
                    .addField(":interrobang: Ricordati...", `
- __Descrivi bene la tua domanda__
Spiega bene di cosa hai bisogno, in modo chiaro
- __Non chiedere di poter chiedere__
Non dire "posso fare una domanda?" ma chiedila direttamente, in modo da non sprecare tempo, sia per te che per noi
- __Non siamo tuoi schiavi__
Non siamo ne onniscenti ne tuoi schiavi, quindi non pretendere di riuscire ad avere una risposta adeguata alle tue aspettative`)
            }

            var button1 = new Discord.MessageButton()
                .setLabel("Chiudi ticket")
                .setStyle("DANGER")
                .setCustomId("ticketChiudi")

            var row = new Discord.MessageActionRow()
                .addComponents(button1)

            menu.message.edit({ embeds: [embed], components: [row] })

            var index = serverstats.ticket.findIndex(x => x.channel == menu.channel.id);
            var ticket = serverstats.ticket[index];
            if (!ticket) return

            serverstats.ticket[index].inserimentoCategory = false;

            menu.channel.permissionOverwrites.edit(ticket.owner, {
                SEND_MESSAGES: true
            })
            menu.channel.permissionOverwrites.edit(settings.idRuoloAiutante, {
                SEND_MESSAGES: true
            })
            menu.channel.permissionOverwrites.edit(settings.idRuoloAiutanteInProva, {
                SEND_MESSAGES: true
            })

            var embed = new Discord.MessageEmbed()
                .setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
                .setColor("#22c90c")
                .addField(":alarm_clock: Time", `${moment(menu.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)
                .addField("Category", `${embed.title.split(" ").slice(1, -1).join(" ")} - Altro...`)

            if (!isMaintenance())
                client.channels.cache.get(log.community.ticket).send({ embeds: [embed] })
        }
        else {
            var embed = new Discord.MessageEmbed()
                .setColor("#4b89db")

            switch (menu.values[0]) {
                case "ticketCategory11": {
                    embed
                        .setTitle(":robot: Problemi con bot :robot:")
                        .setDescription("`Il bot non va online con nessun errore`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Ricordati di salvare il file index__
Se non salvi il file index.js le modifiche al bot non verranno apportate.Salva con CTRL + S
- __Controlla di aver inserito il token corretto__
- __Controlla che il codice sia scritto correttamente e non ti dia errori__ 
- __Controlla che ci sia un video YT__
Giulio ha fatto molti video su bot discord, prima di chiedere a noi controlla che non abbia gia fatto un video riguardo il tuo problema

_Se hai risolto, chiudi questo ticket con ** "Problema risolto" ** _
                        `)
                } break
                case "ticketCategory12": {
                    embed
                        .setTitle(":robot: Problemi con bot :robot:")
                        .setDescription("`Il bot o un comando mi da errore`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Ricordati di salvare il file index__
Se non salvi il file index.js le modifiche al bot non verranno apportate.Salva con CTRL + S
- __Controlla di aver inserito il token corretto__
- __Trova in !code se c'è il tuo errore__
Nel comando \`!code\` puoi trovare una sezione dedicata agli errori più comuni con le rispettive soluzioni
- __Controlla che ci sia un video YT__
Giulio ha fatto molti video su bot discord, prima di chiedere a noi controlla che non abbia gia fatto un video riguardo il tuo problema

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break
                case "ticketCategory13": {
                    embed
                        .setTitle(":robot: Problemi con bot :robot:")
                        .setDescription("`Non so come creare una funzione`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Se è troppo complessa per te, lascia stare__
Se il tuo livello con discord.js è ancora troppo basso per questa funzione, non correre, vai piano e inizia con funzioni più semplici
- __In !code trovi tantissimi comandi/funzioni__
Nel comando \`!code\` trovi tante categorie di diverse funzioni da implementare nel tuo bot
- __Cerca online qualche tutorial__
Il modo migliore per imparare un codice è cercarlo online, con magari anche una spiegazione, invece che copiare e incollare da qua
- __Controlla che ci sia un video YT__
Giulio ha fatto molti video su bot discord, prima di chiedere a noi controlla che non abbia gia fatto un video riguardo il tuo problema

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break
                case "ticketCategory14": {
                    embed
                        .setTitle(":robot: Problemi con bot :robot:")
                        .setDescription("`Problemi con l'hosting su Heroku`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Ho errori durante il deploy manuale__
Controllare di aver creato il file .gitignore. Creare nella cartella del bot un file chiamato esattamente \`.gitignore\` scrivendo dentro \`/node_modules\`. Rifare poi il commit e il push su Github
- __In Resources ho solo web__
Controlla di aver creato correttamente il file Procfile e che sia caricato su Github. Nel file deve esserci scritto esattamente \`worker: node index.js\`

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break


                case "ticketCategory21": {
                    embed
                        .setTitle(":ferris_wheel: Problemi nel server :ferris_wheel:")
                        .setDescription("`Il bot del server non funziona`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Il bot è offline__
Se il bot è offline può essere che ci siano dei test in corso. Attendi almeno una mezzoretta e il bot ritornerà online

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break
                case "ticketCategory22": {
                    embed
                        .setTitle(":ferris_wheel: Problemi nel server :ferris_wheel:")
                        .setDescription("`Voglio segnalare un utente`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Leggi le info__
Nel canale <#869975174383009812> ci sono moltissime informazioni riguardante il server, i canali e i bot

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break


                case "ticketCategory31": {
                    embed
                        .setTitle(":eyes: Domande allo staff :eyes:")
                        .setDescription("`Voglio sponsorizzarmi in self-adv`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Potrai scrivere in self-adv solo con il Level 30 o boostando il server__
Per avere l'accesso a scrivere nel canale <#${settings.idCanaliServer.selfAdv}> dovrai raggiungere il livello 30 oppure boostare il server

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break
                case "ticketCategory32": {
                    embed
                        .setTitle(":eyes: Domande allo staff :eyes:")
                        .setDescription("`Facciamo una collaborazione?`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Collaborazione tra server__
Se la tua intenzione è quella di sponsorizzarci a vicenda nei nostri server, la tua richiesta non verrà purtroppo accettata.
Per una collaborazione più sensata, apri pure il ticket

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break
                case "ticketCategory33": {
                    embed
                        .setTitle(":eyes: Domande allo staff :eyes:")
                        .setDescription("`Voglio candidarmi come mod/aiutante`")
                        .addField(":brain: Alcune soluzioni", `
Prima di parlare con lo staff cerca di risolvere il problema da solo

- __Candidatura come Aiutante__
Puoi partecipare alle candidature per diventare aiutante nel server nel canale <#${settings.idCanaliServer.becomeHelper}>. Nel caso le iscrizioni fossero chiuse, riprova tra qualche settimana
- __Candidatura come Moderatore__
Per diventare moderatore all'interno di questo server, non serve nessun provino. Un nuovo membro dello staff viene scelto in base alla tua presenza nelle chat del server, quanto aiuti gli altri utenti e quanto il tuo carattere impatta in quello che scrivi. In sostanza, non ti puoi candidare come moderatore

_Se hai risolto, chiudi questo ticket con **"Problema risolto"**_
`)
                } break
            }

            embed
                .addField(":weary: Non hai ancora risolto?", `
Se con le **soluzioni** qua sopra non hai ancora risolto, **apri il ticket** per parlare direttamente con lo staff
`)

            var button1 = new Discord.MessageButton()
                .setLabel("Problema risolto")
                .setStyle("DANGER")
                .setCustomId("ticketChiudi")

            var button2 = new Discord.MessageButton()
                .setLabel("Apri ticket")
                .setStyle("PRIMARY")
                .setCustomId("ticketApri")

            var row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            menu.message.edit({ embeds: [embed], components: [row] })
        }
    },
};