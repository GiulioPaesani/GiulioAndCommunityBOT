module.exports = {
	name: `clickButton`,
	async execute(button) {
		if (button.id != 'ticketChiudi') return;

		button.reply.defer()

		if (isMaintenance(button.clicker.user.id)) return

		var index = serverstats.ticket.findIndex((x) => x.channel == button.channel.id);
		var ticket = serverstats.ticket[index];

		if (!utenteMod(button.clicker.member) && button.clicker.user.id != ticket.owner && !button.clicker.member.roles.cache.has(settings.idRuoloAiutante) && !button.clicker.member.roles.cache.has(settings.idRuoloAiutanteInProva)) {
			return;
		}
		else {
			if (button.message.components[0].components[0].label == "Chiudi ticket") {
				button.message.components[0].components[0].label = "In chiusura..."
				button.message.components[0].components[0].disabled = true

				button.message.edit({
					embed: button.message.embeds[0],
					components: button.message.components
				})
			}
			else {
				button.message.components[0].components[0].label = "In chiusura..."
				button.message.components[0].components[0].disabled = true
				button.message.components[0].components[1].disabled = true

				button.message.edit({
					embed: button.message.embeds[0],
					components: button.message.components
				})
			}

			var embed = new Discord.MessageEmbed()
				.setTitle("Ticket in chiusura...")
				.setColor("#ED1C24")
				.setDescription("Questo ticket si chiuderà tra `30 secondi`")

			var button1 = new disbut.MessageButton()
				.setLabel("Annulla")
				.setStyle("red")
				.setID("annullaChiusura")

			var idChannelTicket = ticket.channel
			button.message.channel.send(embed, button1)
				.then(msg => {
					ticket.daEliminare = true;
					serverstats.ticket[serverstats.ticket.findIndex((x) => x.channel == idChannelTicket)] = ticket;

					setTimeout(function () {
						var ticket = serverstats.ticket.find((x) => x.channel == idChannelTicket);
						if (!ticket) return;

						if (ticket.daEliminare) {
							embed.setDescription("Questo ticket si chiuderà tra `20 secondi`")
							msg.edit(embed)
								.catch(() => { })

							setTimeout(function () {
								var ticket = serverstats.ticket.find((x) => x.channel == idChannelTicket);
								if (!ticket) return;

								if (ticket.daEliminare) {
									embed.setDescription("Questo ticket si chiuderà tra `10 secondi`")
									msg.edit(embed)
										.catch(() => { })

									setTimeout(function () {
										var ticket = serverstats.ticket.find((x) => x.channel == idChannelTicket);
										if (!ticket) return;

										if (ticket.daEliminare) {
											client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
												.then(async msg => {
													var embed = new Discord.MessageEmbed()
														.setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
														.setColor("#22c90c")
														.addField(":alarm_clock: Time", `${moment(button.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
														.addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)

													if (msg.embeds[0].title == ":speech_balloon: Segli CATEGORIA :speech_balloon:")
														embed.addField("Category", `_Null_`)
													else if (!msg.embeds[0].description.endsWith("`"))
														embed.addField("Category", msg.embeds[0].title.split(" ").slice(1, -1).join(" "))
													else
														embed.addField("Category", `${msg.embeds[0].title.split(" ").slice(1, -1).join(" ")} - ${msg.embeds[0].description.slice(1, -1)}`)

													if (ticket.inserimentoCategory)
														if (!isMaintenance())
															client.channels.cache.get(log.community.ticket).send(embed)

													var embed = new Discord.MessageEmbed()
														.setTitle(":paperclips: Ticket closed :paperclips:")
														.setColor("#e31705")
														.addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
														.addField(":brain: Executor", `${button.clicker.user.toString()} - ID: ${button.clicker.user.id}`, false)
														.addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)
														.addField("Category", `${msg.embeds[0].title.split(" ").slice(1, -1).join(" ")} - ${msg.embeds[0].description.split("`")[1]}`)

													var chatLog = ""
													await button.channel.messages.fetch({ limit: 1000 })
														.then(async messages => {
															for (var msg of messages.array().reverse()) {
																var attachments = ""
																msg.attachments.array().forEach(attachment => {
																	attachments += `${attachment.name} (${attachment.url}), `
																})
																if (attachments != "")
																	attachments = attachments.slice(0, -2)

																chatLog += `${msg.author.bot ? "[BOT] " : msg.author.id == ticket.owner ? "[OWNER] " : utenteMod(msg.author) ? "[MOD] " : (msg.member.roles.cache.has(settings.idRuoloAiutante) || msg.member.roles.cache.has(settings.idRuoloAiutanteInProva)) ? "[HELPER] " : ""}@${msg.author.username} - ${moment(msg.createdAt).format("ddd DD HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? `\nEmbed: ${msg.embeds[0].title}` : ""}${attachments ? `\nAttachments: ${attachments}` : ""}\n\n`
															}
														})

													if (chatLog != "") {
														var attachment1 = await new Discord.MessageAttachment(
															Buffer.from(chatLog, "utf-8"), `ticket${ticket.channel}-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.txt`
														);
														if (!isMaintenance())
															client.channels.cache.get(log.community.ticket).send({ embed, files: [attachment1] })
													}
													else
														if (!isMaintenance())
															client.channels.cache.get(log.community.ticket).send(embed)

													embed.setDescription("Questo ticket si sta per chiudere")
													msg.edit(embed)
														.catch(() => { })

													button.channel.delete()
														.catch(() => { });
													serverstats.ticket = serverstats.ticket.filter((x) => x.channel != idChannelTicket);
												})

										}
									}, 10000);
								}
							}, 10000);
						}
					}, 10000);
				})
		}
	}
};
