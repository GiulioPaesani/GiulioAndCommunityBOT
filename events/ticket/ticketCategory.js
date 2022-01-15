module.exports = {
    name: `clickMenu`,
    async execute(menu) {
        if (!menu.id.startsWith("ticketCategory")) return

        if (isMaintenance(menu.clicker.user.id)) return

        if (menu.id.split(",")[1] != menu.clicker.user.id) return menu.reply.defer()

        menu.reply.defer()

        var embed = new Discord.MessageEmbed()
            .setColor("#4b89db")
            .setDescription("Seleziona la **sotto-categoria** più appartenente al tuo problema, in modo da ricevere una **soluzione migliore**")
            .setFooter("Seleziona la sotto-categoria per continuare")

        var select = new disbut.MessageMenu()
            .setID(`ticketSubCategory,${menu.clicker.user.id}`)
            .setPlaceholder('Select subcategory...')
            .setMaxValues(1)
            .setMinValues(1)

        switch (menu.values[0]) {
            case "ticketCategory1": {
                embed
                    .setTitle(":robot: Problemi con bot :robot:")
                    .addField("Sotto-categorie", `
- Il bot non va online con nessun errore
- Il bot o un comando mi da errore
- Problemi con l'hosting su Heroku
- Non so come creare una funzione
- Altro...`)

                var option1 = new disbut.MessageMenuOption()
                    .setLabel('Il bot non va online con nessun errore')
                    .setEmoji("🔹")
                    .setValue('ticketCategory11')
                    .setDescription('Il bot non risulta online ma senza errori in console')

                var option2 = new disbut.MessageMenuOption()
                    .setLabel('Il bot o un comando mi da errore')
                    .setEmoji("🔹")
                    .setValue('ticketCategory12')
                    .setDescription('Viene mandato un errore in console sconosciuto')

                var option3 = new disbut.MessageMenuOption()
                    .setLabel('Non so come creare una funzione')
                    .setEmoji("🔹")
                    .setValue('ticketCategory13')
                    .setDescription('Ho bisogno di aiuto per un comando/funzione')

                var option4 = new disbut.MessageMenuOption()
                    .setLabel('Problemi con l\'hosting su Heroku')
                    .setEmoji("🔹")
                    .setValue('ticketCategory14')
                    .setDescription('Ho problemi ad hostare il mio bot su Heroku')

                var option5 = new disbut.MessageMenuOption()
                    .setLabel('Altro...')
                    .setEmoji("🔹")
                    .setValue('ticketCategory15')
                    .setDescription('Altre tipologie di problemi o di supporto')

                select
                    .addOption(option1)
                    .addOption(option2)
                    .addOption(option3)
                    .addOption(option4)
                    .addOption(option5)
            } break
            case "ticketCategory2": {
                embed
                    .setTitle(":ferris_wheel: Problemi nel server :ferris_wheel:")
                    .addField("Sotto-categorie", `
- Il bot del server non funziona
- Voglio segnalare un utente
- Altro...`)

                var option1 = new disbut.MessageMenuOption()
                    .setLabel('Il bot del server non funziona')
                    .setEmoji("🔹")
                    .setValue('ticketCategory21')
                    .setDescription('Il bot del server ha un errore o mi da problemi')

                var option2 = new disbut.MessageMenuOption()
                    .setLabel('Voglio segnalare un utente')
                    .setEmoji("🔹")
                    .setValue('ticketCategory22')
                    .setDescription('Voglio segnalare un comportamento scorretto di un utente')

                var option3 = new disbut.MessageMenuOption()
                    .setLabel('Altro...')
                    .setEmoji("🔹")
                    .setValue('ticketCategory23')
                    .setDescription('Altre tipologie di problemi o di supporto')

                select
                    .addOption(option1)
                    .addOption(option2)
                    .addOption(option3)
            } break
            case "ticketCategory3": {
                embed
                    .setTitle(":eyes: Domande allo staff :eyes:")
                    .addField("Sotto-categorie", `
- Voglio sponsorizzarmi in self-adv
- Facciamo una collaborazione?
- Voglio candidarmi come mod/aiutante
- Altro...`)

                var option1 = new disbut.MessageMenuOption()
                    .setLabel('Voglio sponsorizzarmi in self-adv')
                    .setEmoji("🔹")
                    .setValue('ticketCategory31')
                    .setDescription('Come posso scrivere in self-adv?')

                var option2 = new disbut.MessageMenuOption()
                    .setLabel('Facciamo una collaborazione?')
                    .setEmoji("🔹")
                    .setValue('ticketCategory32')
                    .setDescription('Vorrei proporre una collaborazione')

                var option3 = new disbut.MessageMenuOption()
                    .setLabel('Voglio candidarmi come mod/aiutante?')
                    .setEmoji("🔹")
                    .setValue('ticketCategory33')
                    .setDescription('Vorrei far parte dello staff in questo server')

                var option4 = new disbut.MessageMenuOption()
                    .setLabel('Altro...')
                    .setEmoji("🔹")
                    .setValue('ticketCategory34')
                    .setDescription('Altre tipologie di problemi o di supporto')

                select
                    .addOption(option1)
                    .addOption(option2)
                    .addOption(option3)
                    .addOption(option4)
            } break
        }

        var button1 = new disbut.MessageButton()
            .setLabel("Torna indietro")
            .setStyle("red")
            .setID(`ticketCategoryIndietro,${menu.clicker.user.id}`)

        menu.message.edit({
            embed: embed,
            components: [
                {
                    type: 1,
                    components: [select],
                },
                {
                    type: 1,
                    components: [button1]
                }
            ]
        })
    },
};