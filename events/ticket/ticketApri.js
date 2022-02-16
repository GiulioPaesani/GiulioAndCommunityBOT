module.exports = {
	name: `interactionCreate`,
	async execute(button) {
		if (!button.isButton()) return
		if (button.customId != 'ticketApri') return;

		button.deferUpdate().catch(() => { })

		if (isMaintenance(button.user.id)) return

		var embed = new Discord.MessageEmbed()
			.setTitle(button.message.embeds[0].title)
			.setColor("#fcba03")
			.setDescription(`${button.message.embeds[0].description}
Il ticket è stato **aperto**, ora puoi parlare con lo staff`)

		if (button.message.embeds[0].title == ":eyes: Domande allo staff :eyes:") {
			embed
				.addField(":interrobang: Ricordati...", `
- __Descrivi bene la tua domanda__
Spiega bene di cosa hai bisogno, in modo chiaro
- __Non chiedere di poter chiedere__
Non dire "posso fare una domanda?" ma chiedila direttamente, in modo da non sprecare tempo, sia per te che per noi
- __Non siamo tuoi schiavi__
Non siamo ne onniscenti ne tuoi schiavi, quindi non pretendere di riuscire ad avere una risposta adeguata alle tue aspettative`)
		}
		else if (button.message.embeds[0].title == ":ferris_wheel: Problemi nel server :ferris_wheel:") {
			embed
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
				.addField(":interrobang: Ricordati...", `
- __Descrivi bene il tuo problema__
Spiega bene cosa c'è che non va già da subito, invia eventuali errori e codice
- __Non chiedere di poter chiedere__
Non dire "posso chiedere aiuto?" ma chiedilo direttamente, in modo da non sprecare tempo, sia per te che per noi
- __Non siamo tuoi schiavi__
Non siamo ne onniscenti ne tuoi schiavi, quindi non pretendere di riuscire a risolvere il problema o di ricevere funzioni e codici complessi o lunghi
- __Cerca sempre di risolvere il problema da solo__
Farsi correggere o mandare codice da altri non è mai un buon strumento per imparare. Cerca sempre di capire cosa sbagli e come non sbagliare più. Insomma non essere stupido`)
		}

		var button1 = new Discord.MessageButton()
			.setLabel("Chiudi ticket")
			.setStyle("DANGER")
			.setCustomId("ticketChiudi")

		var row = new Discord.MessageActionRow()
			.addComponents(button1)

		button.message.edit({ embeds: [embed], components: [row] })

		var index = serverstats.ticket.findIndex(x => x.channel == button.channel.id);
		var ticket = serverstats.ticket[index];
		if (!ticket) return

		serverstats.ticket[index].inserimentoCategory = false;

		button.channel.permissionOverwrites.edit(ticket.owner, {
			SEND_MESSAGES: true
		})
		button.channel.permissionOverwrites.edit(settings.idRuoloAiutante, {
			SEND_MESSAGES: true
		})
		button.channel.permissionOverwrites.edit(settings.idRuoloAiutanteInProva, {
			SEND_MESSAGES: true
		})
		button.deferUpdate().catch(() => { })

		var embed = new Discord.MessageEmbed()
			.setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
			.setColor("#22c90c")
			.addField(":alarm_clock: Time", `${moment(button.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
			.addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)
			.addField("Category", `${button.message.embeds[0].title.split(" ").slice(1, -1).join(" ")} - ${button.message.embeds[0].description.slice(1, -1)}`)

		if (!isMaintenance())
			client.channels.cache.get(log.community.ticket).send({ embeds: [embed] })
	}
};
