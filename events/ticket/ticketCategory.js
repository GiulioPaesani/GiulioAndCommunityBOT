module.exports = {
    name: `interactionCreate`,
    async execute(menu) {
        if (!menu.isSelectMenu()) return
        if (!menu.customId.startsWith("ticketCategory")) return

        if (isMaintenance(menu.user.id)) return

        if (menu.customId.split(",")[1] != menu.user.id) return menu.deferUpdate()

        menu.deferUpdate()

        var embed = new Discord.MessageEmbed()
            .setColor("#4b89db")
            .setDescription("Seleziona la **sotto-categoria** più appartenente al tuo problema, in modo da ricevere una **soluzione migliore**")
            .setFooter("Seleziona la sotto-categoria per continuare")

        var select = new Discord.MessageSelectMenu()
            .setCustomId(`ticketSubCategory,${menu.user.id}`)
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

                select
                    .addOptions({
                        label: "Il bot non va online con nessun errore",
                        emoji: "🔹",
                        value: "ticketCategory11",
                        description: "Il bot non risulta online ma senza errori in console"
                    })
                    .addOptions({
                        label: "Il bot o un comando mi da errore",
                        emoji: "🔹",
                        value: "ticketCategory12",
                        description: "Viene mandato un errore in console sconosciuto"
                    })
                    .addOptions({
                        label: "Non so come creare una funzione",
                        emoji: "🔹",
                        value: "ticketCategory13",
                        description: "Ho bisogno di aiuto per un comando/funzione"
                    })
                    .addOptions({
                        label: "Problemi con l'hosting su Heroku",
                        emoji: "🔹",
                        value: "ticketCategory14",
                        description: "Ho problemi ad hostare il mio bot su Heroku"
                    })
                    .addOptions({
                        label: "Altro...",
                        emoji: "🔹",
                        value: "ticketCategory15",
                        description: "Altre tipologie di problemi o di supporto"
                    })
            } break
            case "ticketCategory2": {
                embed
                    .setTitle(":ferris_wheel: Problemi nel server :ferris_wheel:")
                    .addField("Sotto-categorie", `
- Il bot del server non funziona
- Voglio segnalare un utente
- Altro...`)
                select
                    .addOptions({
                        label: "Il bot del server non funziona",
                        emoji: "🔹",
                        value: "ticketCategory21",
                        description: "Il bot del server ha un errore o mi da problemi"
                    })
                    .addOptions({
                        label: "Voglio segnalare un utente",
                        emoji: "🔹",
                        value: "ticketCategory22",
                        description: "Voglio segnalare un comportamento scorretto di un utente"
                    })
                    .addOptions({
                        label: "Altro...",
                        emoji: "🔹",
                        value: "ticketCategory23",
                        description: "Altre tipologie di problemi o di supporto"
                    })
            } break
            case "ticketCategory3": {
                embed
                    .setTitle(":eyes: Domande allo staff :eyes:")
                    .addField("Sotto-categorie", `
- Voglio sponsorizzarmi in self-adv
- Facciamo una collaborazione?
- Voglio candidarmi come mod/aiutante
- Altro...`)

                select
                    .addOptions({
                        label: "Voglio sponsorizzarmi in self-adv",
                        emoji: "🔹",
                        value: "ticketCategory31",
                        description: "Come posso scrivere in self-adv?"
                    })
                    .addOptions({
                        label: "Facciamo una collaborazione?",
                        emoji: "🔹",
                        value: "ticketCategory32",
                        description: "Vorrei proporre una collaborazione"
                    })
                    .addOptions({
                        label: "Voglio candidarmi come mod/aiutante",
                        emoji: "🔹",
                        value: "ticketCategory33",
                        description: "Vorrei far parte dello staff in questo server"
                    })
                    .addOptions({
                        label: "Altro...",
                        emoji: "🔹",
                        value: "ticketCategory34",
                        description: "Altre tipologie di problemi o di supporto"
                    })
            } break
        }

        var button1 = new Discord.MessageButton()
            .setLabel("Torna indietro")
            .setStyle("DANGER")
            .setCustomId(`ticketCategoryIndietro,${menu.user.id}`)

        var row = new Discord.MessageActionRow()
            .addComponents(select)

        var row2 = new Discord.MessageActionRow()
            .addComponents(button1)

        menu.message.edit({
            embeds: [embed],
            components: [row, row2]
        })
    },
};