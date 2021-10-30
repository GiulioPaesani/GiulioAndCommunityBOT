module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (button.id != 'apriTicket') return;

		var ticket = serverstats.ticket;

		if (button.channel.id == config.idCanaliServer.staffHelp) {
			if (ticket.find((x) => x.type == 'Normal' && x.owner == button.clicker.user.id)) {
				if (client.channels.cache.get(ticket.channel)) {
					var embed = new Discord.MessageEmbed()
						.setTitle('Ticket già aperto')
						.setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png')
						.setColor('#8F8F8F')
						.setDescription(
							`Puoi aprire un solo ticket di supporto alla volta\rHai gia un ticket aperto in <#${ticket.find(
								(x) => x.type == 'Normal' && x.owner == button.clicker.user.id
							).channel}>`
						);

					button.clicker.user.send(embed).catch();
					return;
				} else {
					serverstats.ticket = serverstats.ticket.filter((x) => x.channel != ticket.channel);
				}
			}

			var server = client.guilds.cache.get(config.idServer);
			server.channels
				.create(`ticket-${button.clicker.user.username}`, {
					type: 'text',
					permissionOverwrites: [
						{
							id: server.id,
							deny: [ 'VIEW_CHANNEL' ]
						},
						{
							id: button.clicker.user.id,
							allow: [ 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS' ]
						},
						{
							id: config.idRuoloAiutante,
							allow: [ 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS' ]
						},
						{
							id: config.idRuoloAiutanteInProva,
							allow: [ 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS' ]
						}
					],
					parent: config.idCanaliServer.categoriaTicket
				})
				.then((canale) => {
					var embed = new Discord.MessageEmbed()
						.setTitle('Ticket aperto')
						.setColor('#4b9afa')
						.setDescription(
							'In questa chat potrai richiedere **supporto privato** allo staff\rSe vuoi far arrivare **subito** il messaggio ai mod clicca sul button "Tagga staff"'
						);

					let button1 = new disbut.MessageButton()
						.setLabel('Chiudi ticket')
						.setStyle('red')
						.setID('chiudiTicket');

					let button2 = new disbut.MessageButton()
						.setLabel('Tagga staff')
						.setStyle('blurple')
						.setID('taggaStaff');

					let row = new disbut.MessageActionRow().addComponent(button1).addComponent(button2);

					canale
						.send({
							component: row,
							embed: embed
						})
						.then((msg) => {
							ticket.push({
								type: 'Normal',
								channel: canale.id,
								owner: button.clicker.user.id,
								modTaggati: false,
								message: msg.id,
								daEliminare: false
							});
							serverstats.ticket = ticket;
						});

					canale.send(`<@${button.clicker.user.id}> ecco il tuo ticket\r`).then((msg) => {
						msg.delete().catch(() => {});
					});
				});
		}
		if (
			button.channel.id == config.idCanaliServer.mutedTicket ||
			button.channel.id == config.idCanaliServer.tempmutedTicket ||
			button.channel.id == config.idCanaliServer.bannedTicket ||
			button.channel.id == config.idCanaliServer.tempbannedTicket
		) {
			if (ticket.find((x) => x.type == 'Moderation' && x.owner == button.clicker.user.id)) {
				var embed = new Discord.MessageEmbed()
					.setTitle('Ticket già aperto')
					.setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png')
					.setColor('#8F8F8F')
					.setDescription(
						`Puoi aprire un solo ticket di moderazione alla volta\rHai gia un ticket aperto in <#${ticket.find(
							(x) => x.type == 'Moderation' && x.owner == button.clicker.user.id
						).channel}>`
					);

				button.clicker.user.send(embed).catch();
				return;
			}

			var server = client.guilds.cache.get(config.idServer);
			server.channels
				.create(`${button.clicker.user.username}`, {
					type: 'text',
					permissionOverwrites: [
						{
							id: server.id,
							deny: [ 'VIEW_CHANNEL' ]
						},
						{
							id: button.clicker.user.id,
							allow: [ 'VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS' ]
						}
					],
					parent: config.idCanaliServer.categoriaModerationTicket
				})
				.then((canale) => {
					var embed = new Discord.MessageEmbed()
						.setTitle('Segnalazione aperta')
						.setColor('#6143CB')
						.setDescription(
							'In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione'
						);

					let button1 = new disbut.MessageButton()
						.setLabel('Chiudi ticket')
						.setStyle('red')
						.setID('chiudiTicket');

					let button2 = new disbut.MessageButton()
						.setLabel('Tagga staff')
						.setStyle('blurple')
						.setID('taggaStaff');

					let row = new disbut.MessageActionRow().addComponent(button1).addComponent(button2);

					canale
						.send({
							component: row,
							embed: embed
						})
						.then((msg) => {
							ticket.push({
								type: 'Moderation',
								channel: canale.id,
								owner: button.clicker.user.id,
								modTaggati: false,
								message: msg.id,
								daEliminare: false
							});
							serverstats.ticket = ticket;
						});

					canale.send(`<@${button.clicker.user.id}> ecco il tuo ticket\r`).then((msg) => {
						msg.delete().catch(() => {});
					});
				});
		}
	}
};
