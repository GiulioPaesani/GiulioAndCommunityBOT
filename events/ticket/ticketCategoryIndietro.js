module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (!button.id.startsWith('ticketCategoryIndietro')) return;

        if (isMaintenance(button.clicker.user.id)) return

		if (button.id.split(",")[1] != button.clicker.user.id) return button.reply.defer()

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

		var option1 = new disbut.MessageMenuOption()
			.setLabel('Problemi con bot')
			.setEmoji("🤖")
			.setValue('ticketCategory1')
			.setDescription('Problemi con il tuo bot in Discord.js')

		var option2 = new disbut.MessageMenuOption()
			.setLabel('Problemi nel server')
			.setEmoji("🎡")
			.setValue('ticketCategory2')
			.setDescription("Problemi con bot o utenti nel server")

		var option3 = new disbut.MessageMenuOption()
			.setLabel('Domande allo staff')
			.setEmoji("👀")
			.setValue('ticketCategory3')
			.setDescription("Domande di altro tipo allo staff")

		var select = new disbut.MessageMenu()
			.setID(`ticketCategory,${button.clicker.user.id}`)
			.setPlaceholder('Select category...')
			.setMaxValues(1)
			.setMinValues(1)
			.addOption(option1)
			.addOption(option2)
			.addOption(option3)

		button.message.edit(embed, select)
	}
};
