module.exports = {
	name: `interactionCreate`,
	async execute(button) {
		if (!button.isButton()) return
		if (button.customId != 'annullaChiusura') return;

		button.deferUpdate().catch(() => { })

		if (isMaintenance(button.user.id)) return

		var index = serverstats.ticket.findIndex((x) => x.channel == button.channel.id);
		var ticket = serverstats.ticket[index];

		if (ticket.daEliminare) {
			ticket.daEliminare = false;
			serverstats.ticket[serverstats.ticket.findIndex(x => x.channel == button.channel.id)] = ticket;

			button.message.delete()
				.catch(() => { })

			client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
				.then(msg => {
					if (msg.embeds[0].fields[0].name == ":brain: Alcune soluzioni") {
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

						msg.edit({ embeds: [msg.embeds[0]], components: [row] })
					}
					else {
						var button1 = new Discord.MessageButton()
							.setLabel("Chiudi ticket")
							.setStyle("DANGER")
							.setCustomId("ticketChiudi")

						var row = new Discord.MessageActionRow()
							.addComponents(button1)

						if (!ticket.inserimentoCategory)
							msg.edit({ embeds: [msg.embeds[0]], components: [row] })
					}

					button.deferUpdate().catch(() => { })
				})
		}
	}
};
