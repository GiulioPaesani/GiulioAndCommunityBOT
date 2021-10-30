module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (button.id != 'chiudiTicket') return;

		var index = serverstats.ticket.findIndex((x) => x.channel == button.channel.id);
		var ticket = serverstats.ticket[index];

		if (!utenteMod(button.clicker.member) && button.clicker.user.id != ticket.owner && !button.clicker.member.roles.cache.has(config.idRuoloAiutante) && !button.clicker.member.roles.cache.has(config.idRuoloAiutanteInProva)) {
			let embed = new Discord.MessageEmbed()
				.setTitle('Non hai il permesso')
				.setColor('#9E005D')
				.setDescription('Hai il permesso di chiudere questo ticket');

			var data = new Date();
			if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
				embed.setThumbnail('https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png');
			} else {
				embed.setThumbnail('https://i.postimg.cc/D0scZ1XW/No-permesso.png');
			}

			button.clicker.user.send(embed);
			return;
		}
		else {
			client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
				.then((msg) => {
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
							.setDescription('In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione');
					}

					msg.edit({
						component: null,
						embed: embed
					});
				});

			var embed = new Discord.MessageEmbed()
				.setTitle('Ticket in eliminazione')
				.setColor('#16A0F4')
				.setDescription('Questo ticket si cancellerà tra 10 secondi');

			var data = new Date();
			if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
				embed.setThumbnail('https://i.postimg.cc/NFXTGVdf/Correct-Halloween.png');
			} else {
				embed.setThumbnail('https://i.postimg.cc/SRpBjMg8/Giulio.png');
			}

			var button1 = new disbut.MessageButton()
				.setLabel('Annulla')
				.setStyle('red')
				.setID('annullaChiusura');

			button.message.channel.send({
				component: button1,
				embed: embed
			});

			ticket.daEliminare = true;
			serverstats.ticket[serverstats.ticket.findIndex((x) => x.channel == ticket.channel)] = ticket;

			var idCanale = ticket.channel;
			setTimeout(function () {
				var ticket = serverstats.ticket.find((x) => x.channel == idCanale);
				if (!ticket) return;

				if (ticket.daEliminare) {
					button.channel.delete()
						.catch(() => { });
					serverstats.ticket = serverstats.ticket.filter((x) => x.channel != ticket.channel);
				}
			}, 10000);
		}
	}
};
