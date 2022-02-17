module.exports = {
	name: `interactionCreate`,
	async execute(button) {
		if (!button.isButton()) return
		if (!button.customId.startsWith('ticketCategoryIndietro')) return;

		button.deferUpdate().catch(() => { })

		if (isMaintenance(button.user.id)) return

		if (button.customId.split(",")[1] != button.user.id) return button.deferUpdate().catch(() => { })

		var embed = new Discord.MessageEmbed()
			.setTitle(":speech_balloon: Segli CATEGORIA :speech_balloon:")
			.setColor("#4b89db")
			.setDescription("**Definisci** correttamente il tuo ticket in modo da ricevere il **miglior supporto** possibile")
			.addField("Categorie", `
:robot: __Problemi con bot__
↳ Il bot non va online con nessun errore
↳ Il bot o un comando mi da errore
↳ Non so come creare una funzione
↳ Altro...

:ferris_wheel: __Problemi nel server__
↳ Il bot del server non funziona
↳ Voglio segnalare un utente
↳ Altro...

:eyes: __Domande allo staff__
↳ Voglio sponsorizzarmi in self-adv
↳ Facciamo una collaborazione?
↳ Voglio candidarmi come mod/aiutante
↳ Altro...
`)
			.setFooter("Seleziona la categoria per continuare")

		var select = new Discord.MessageSelectMenu()
			.setCustomId(`ticketCategory,${button.user.id}`)
			.setPlaceholder('Select category...')
			.setMaxValues(1)
			.setMinValues(1)
			.addOptions({
				label: "Problemi con bot",
				emoji: "🤖",
				value: "ticketCategory1",
				description: "Problemi con il tuo bot in Discord.js"
			})
			.addOptions({
				label: "Problemi nel server",
				emoji: "🎡",
				value: "ticketCategory2",
				description: "Problemi con bot o utenti nel server"
			})
			.addOptions({
				label: "Domande allo staff",
				emoji: "👀",
				value: "ticketCategory3",
				description: "Domande di altro tipo allo staff"
			})

		var row = new Discord.MessageActionRow()
			.addComponents(select)

		button.message.edit({ embeds: [embed], components: [row] })
	}
};
