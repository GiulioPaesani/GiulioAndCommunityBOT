module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (button.id != 'apriTicket') return;

		if (isMaintenance(button.clicker.user.id)) return

		var ticket = serverstats.ticket;

		if (button.channel.id == settings.idCanaliServer.staffHelp) {
			if (ticket.find((x) => x.type == 'Normal' && x.owner == button.clicker.user.id)) {
				botMessage(button.clicker.user, "Warning", "Ticket già aperto", "Puoi aprire un solo ticket alla volta")
				button.reply.defer()
					.catch(() => { })
				return
			}

			var userstats = userstatsList.find(x => x.id == button.clicker.user.id)
			if (!userstats) return

			if (userstats.moderation.type == "Muted" || userstats.moderation.type == "Tempmuted") {
				botMessage(button.clicker.user, "Warning", "Non puoi se sei mutato", `Non puoi aprire un ticket di Supporto se sei mutato. Se vuoi parlare con lo staff puoi aprire un ticket in <#${userstats.moderation.type == "Muted" ? settings.idCanaliServer.mutedTicket : settings.idCanaliServer.tempmutedTicket}>`)
				button.reply.defer()
					.catch(() => { })
				return
			}

			var server = client.guilds.cache.get(settings.idServer);
			server.channels
				.create(`ticket-${button.clicker.user.username}`, {
					type: 'text',
					permissionOverwrites: [
						{
							id: server.id,
							deny: ['VIEW_CHANNEL', "SEND_MESSAGES"]
						},
						{
							id: button.clicker.user.id,
							allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
						},
						{
							id: settings.idRuoloAiutante,
							allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
						},
						{
							id: settings.idRuoloAiutanteInProva,
							allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
						},
						{
							id: settings.ruoliModeration.muted,
							deny: ["SEND_MESSAGES"]
						},
						{
							id: settings.ruoliModeration.tempmuted,
							deny: ["SEND_MESSAGES"]
						},
						{
							id: settings.ruoliModeration.banned,
							deny: ['VIEW_CHANNEL', "SEND_MESSAGES"]
						},
						{
							id: settings.ruoliModeration.tempbanned,
							deny: ['VIEW_CHANNEL', "SEND_MESSAGES"]
						}
					],
					parent: settings.idCanaliServer.categoriaTicket
				})
				.then((canale) => {
					button.reply.defer()
						.catch(() => { })

					var embed = new Discord.MessageEmbed()
						.setTitle(":speech_balloon: Segli CATEGORIA :speech_balloon:")
						.setColor("#4b89db")
						.setDescription("**Definisci** correttamente il tuo ticket in modo da ricevere il **miglior supporto** possibile")
						.addField("Categorie", `
:robot: __Problemi con bot__
↳ Il bot non va online con nessun errore
↳ Il bot o un comando mi da errore
↳ Problemi con l'hosting su Heroku
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

					canale
						.send({
							component: select,
							embed: embed
						})
						.then((msg) => {
							ticket.push({
								type: 'Normal',
								channel: canale.id,
								owner: button.clicker.user.id,
								message: msg.id,
								daEliminare: false,
								inserimentoCategory: true,
							});
							serverstats.ticket = ticket;
						});

					canale.send(`<@${button.clicker.user.id}> ecco il tuo ticket`).then((msg) => {
						msg.delete().catch(() => { });
					});
				});
		}
		if (button.channel.id == settings.idCanaliServer.mutedTicket || button.channel.id == settings.idCanaliServer.tempmutedTicket || button.channel.id == settings.idCanaliServer.bannedTicket || button.channel.id == settings.idCanaliServer.tempbannedTicket) {
			if (ticket.find((x) => x.type == 'Moderation' && x.owner == button.clicker.user.id)) {
				botMessage(button.clicker.user, "Warning", "Ticket già aperto", "Puoi aprire un solo ticket alla volta")
				button.reply.defer()
					.catch(() => { })
				return;
			}

			var userstats = userstatsList.find(x => x.id == button.clicker.user.id)
			if (!userstats) return

			if (userstats.moderation.ticketOpened) {
				botMessage(button.clicker.user, "Warning", "Ticket già precedentemente aperto", "Puoi aprire un solo ticket di segnalazione")
				button.reply.defer()
					.catch(() => { })
				return;
			}
			else {
				if (userstats.moderation.type != "") {
					userstatsList[userstatsList.findIndex(x => x.id == button.clicker.user.id)].moderation.ticketOpened = true
				}
			}

			var server = client.guilds.cache.get(settings.idServer);
			server.channels
				.create(`${button.clicker.user.username}`, {
					type: 'text',
					permissionOverwrites: [
						{
							id: server.id,
							deny: ['VIEW_CHANNEL']
						},
						{
							id: button.clicker.user.id,
							allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
						}
					],
					parent: settings.idCanaliServer.categoriaModerationTicket
				})
				.then((canale) => {
					button.reply.defer()
						.catch(() => { })

					var embed = new Discord.MessageEmbed()
						.setTitle(':scales: Segnalazione APERTA :scales:')
						.setColor('#6143CB')
						.setDescription('Segnala o richiedi supporto allo staff per il tuo stato di moderazione');

					var embed2 = new Discord.MessageEmbed()
						.setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
						.setColor("#22c90c")
						.addField(":alarm_clock: Time", `${moment(menu.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
						.addField(":bust_in_silhouette: Owner", `${button.clicker.user.toString()} - ID: ${button.clicker.user.id}`)

					if (userstats.moderation.type != "") {
						if (userstats.moderation.type == "Muted") {
							embed
								.addField(":sound: MUTED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`)

							embed2.addField("Category", "Moderation - Muted")
						}
						if (userstats.moderation.type == "Tempmuted") {
							embed
								.addField(":sound: TEMPMUTED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Until**
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})
**Moderator**
${userstats.moderation.moderator}           
`)
							embed2.addField("Category", "Moderation - Temputed")
						}
						if (userstats.moderation.type == "Banned") {
							embed
								.addField(":speaker: BANNED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`)
							embed2.addField("Category", "Moderation - Banned")
						}
						if (userstats.moderation.type == "Tempbanned") {
							embed
								.addField(":speaker: TEMPBANNED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Until**
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})
**Moderator**
${userstats.moderation.moderator}           
`)
							embed2.addField("Category", "Moderation - Tempbanned")
						}
					}

					var button1 = new disbut.MessageButton()
						.setLabel('Chiudi ticket')
						.setStyle('red')
						.setID('ticketChiudi')

					canale.send({
						component: button1, embed: embed
					})
						.then((msg) => {
							ticket.push({
								type: 'Moderation',
								channel: canale.id,
								owner: button.clicker.user.id,
								message: msg.id,
								daEliminare: false
							});
							serverstats.ticket = ticket;
						});

					canale.send(`<@${button.clicker.user.id}> ecco il tuo ticket\r`).then((msg) => {
						msg.delete().catch(() => { });
					});

					if (!embed2.fields[2])
						embed2.addField("Category", "Moderation")

					// if (!isMaintenance())
					client.channels.cache.get(log.community.ticket).send(embed2)
				});
		}
	}
};