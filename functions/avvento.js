global.sendAvvento = async function () {
	var day = new Date().getDate()
	var month = new Date().getMonth()

	var hours = new Date().getHours()
	var minutes = new Date().getMinutes()
	var seconds = new Date().getSeconds()

	hours = 0;
	minutes = 0;
	seconds = 1;

	day = 12
	month = 11

	var channel = await client.channels.cache.get("907340145383047168")

	if (month == 11 && day <= 25) {
		if (hours == 0 && minutes == 0 && seconds == 1) {
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