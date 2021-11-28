global.sendAvvento = async function () {
	var day = new Date().getDate()
	var month = new Date().getMonth()

	var hours = new Date().getHours()
	var minutes = new Date().getMinutes()

	var channel = await client.channels.cache.get("907340145383047168")

	if (month == 11 && day <= 25) {
		if (hours == 0 && minutes == 0) {
			await channel.messages.fetch().then(async messages => {
				var array = Array.from(messages.values())
				for (var i = 0; i < array.length; i++) {
					await array[i].delete().catch(() => { return })
				}
			})

			if (day < 25) {
				await channel.send(`Si sta avvicinando finalmente il **Natale**, è arrivato il momento dei regali, dei pranzi con i parenti e dei bacini dalla zia
Per attendere con piacere questo grande giorno, potete partecipare all'**Avvento della community**🎄`)

				await channel.send({ files: [avventoJSON.banner.banner] })

				await channel.send(`\u200b
🎁 **Ogni giorno** fino al 25 Dicembre vi aspetta una **fantastica ricompensa** da riscattare, per poi ricevere un mitico **super regalo** il giorno di Natale!`)

				var button = new disbut.MessageButton()
					.setLabel("Riscatta ricompense")
					.setStyle("red")
					.setID("riscattaRicompense")

				var row = new disbut.MessageActionRow()
					.addComponents(button)

				await channel.send(`\u200b
Riscatta tutte le tue ricompense dell'Avvento con il pulsante **"Riscatta ricompense"** qua sotto`)

				await channel.send({ files: [avventoJSON.banner[day]], components: row })
			}
			else {
				await channel.send(`Il Natale è finalmente **arrivato**, il momento dei regali, dei pranzi con i parenti e dei bacini dalla zia, che bello...
Riscattate tutti le ricompense nell'**Avvento della community**🎄`)

				await channel.send({ files: [avventoJSON.banner.banner] })

				await channel.send(`\u200b
🎁 Per **ogni giorno** di Dicembre riscattate una **fantastica ricompensa**, vi aspetta anche un mitico **super regalo**`)

				var button = new MessageButton()
					.setLabel("Riscatta ricompense")
					.setStyle("red")
					.setID("riscattaRicompense")

				var row = new MessageActionRow()
					.addComponents(button)

				await channel.send(`\u200b
Riscatta tutte le tue ricompense dell'Avvento con il pulsante **"Riscatta ricompense"** qua sotto`)

				await channel.send({ files: [avventoJSON.banner[25]], components: row })
			}
		}
	}
}

global.sendAvventoReminder = async function () {
	var day = new Date().getDate()
	var month = new Date().getMonth()

	var hours = new Date().getHours()
	var minutes = new Date().getMinutes()

	var channel = await client.channels.cache.get("869975177935593483")

	if (month == 11 && day <= 25) {
		if (hours == 8 && minutes == 0) {
			if (day < 25) {
				var embed = new Discord.MessageEmbed()
					.setTitle(`<:closegift:910604692013342720> Nuova ricompensa - ${day} Dicembre <:closegift:910604692013342720>`)
					.setColor("#ED1C24")
					.setDescription(`\`-${25 - day} giorni a Natale\`
Manca poco ai regali, ai panettoni, alle cene dai parenti... Aspetta il grande giorno con una nuova ricompensa nell'**Avvento della community**
Vai in <#907340145383047168> e riscatta la **ricompensa di** oggi`)
					.setImage(avventoJSON.banner[day])

				channel.send(embed)
			}
			else {
				var embed = new Discord.MessageEmbed()
					.setTitle(`<:closegift:910604692013342720> Nuova super ricompensa - ${day} Dicembre <:closegift:910604692013342720>`)
					.setColor("#ED1C24")
					.setDescription(`\`Natale è arrivato\`
È arrivato finalmente il grande giorno: regali, panettoni, cene con i parenti
Vai in <#907340145383047168> e riscatta il **super regalo** di oggi`)
					.setImage(avventoJSON.banner[day])

				channel.send(embed)
			}
		}
	}
}