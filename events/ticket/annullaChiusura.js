module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (button.id != 'annullaChiusura') return;

		var index = serverstats.ticket.findIndex((x) => x.channel == button.channel.id);
		var ticket = serverstats.ticket[index];

		if (ticket.daEliminare) {
			ticket.daEliminare = false;
			serverstats.ticket[index] = ticket;
			button.message.delete().catch(() => {});

			client.channels.cache.get(ticket.channel).messages.fetch(ticket.message).then((msg) => {
				if (ticket.type == 'Normal') {
					var embed = new Discord.MessageEmbed()
						.setTitle('Ticket aperto')
						.setColor('#4b9afa')
						.setDescription('In questa chat potrai richiedere **supporto privato** allo staff');
				}
				if (ticket.type == 'Moderation') {
					var embed = new Discord.MessageEmbed()
						.setTitle('Segnalazione aperta')
						.setColor('#6143CB')
						.setDescription(
							'In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione'
						);
				}

				let button1 = new disbut.MessageButton()
					.setLabel('Chiudi ticket')
					.setStyle('red')
					.setID('chiudiTicket');

				let button2 = new disbut.MessageButton()
					.setLabel('Tagga staff')
					.setStyle('blurple')
					.setID('taggaStaff');

				let row = new disbut.MessageActionRow().addComponent(button1);

				if (!ticket.modTaggati) row.addComponent(button2);

				msg.edit({
					component: row,
					embed: embed
				});
			});
		}
	}
};
