module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (button.id != 'annullaChiusura') return;

		button.reply.defer().catch(() => { })

		if (isMaintenance(button.clicker.user.id)) return

		var index = serverstats.ticket.findIndex((x) => x.channel == button.channel.id);
		var ticket = serverstats.ticket[index];

		if (ticket.daEliminare) {
			ticket.daEliminare = false;
			serverstats.ticket[serverstats.ticket.findIndex(x => x.channel == button.channel.id)] = ticket;

			button.message.delete()

			client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
				.then(msg => {
					if (msg.embeds[0].fields[0].name == ":brain: Alcune soluzioni") {
						var button1 = new disbut.MessageButton()
							.setLabel("Problema risolto")
							.setStyle("red")
							.setID("ticketChiudi")

						var button2 = new disbut.MessageButton()
							.setLabel("Apri ticket")
							.setStyle("blurple")
							.setID("ticketApri")

						var row = new disbut.MessageActionRow()
							.addComponent(button1)
							.addComponent(button2)

						msg.edit(msg.embeds[0], row)

					}
					else {
						var button1 = new disbut.MessageButton()
							.setLabel("Chiudi ticket")
							.setStyle("red")
							.setID("ticketChiudi")

						if (!ticket.inserimentoCategory)
							msg.edit(msg.embeds[0], button1)
					}

					button.reply.defer().catch(() => { })
				})
		}
	}
};
