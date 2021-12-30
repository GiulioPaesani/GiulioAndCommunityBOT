global.sendAvvento = async function () {
	var day = new Date().getDate()
	var month = new Date().getMonth()

	var hours = new Date().getHours()
	var minutes = new Date().getMinutes()
	var seconds = new Date().getSeconds()

	var channel = await client.channels.cache.get("907340145383047168")

	if (month == 11 && day <= 25) {
		if (hours == 0 && minutes == 0 && seconds == 0) {
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
	var seconds = new Date().getSeconds()

	var channel = await client.channels.cache.get("869975177935593483")

	if (month == 11 && day <= 25) {
		if (hours == 8 && minutes == 0 && seconds == 0) {
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

setInterval(() => {
	var idCanale = "869979989427253329" //!Cambiare
	var numdata = 30 //!Cambiare mettere 31
	var numdata2 = 31 //!Cambiare mettere 1

	var data = new Date()
	if (data.getSeconds() == 0) {
		if (data.getDate() == numdata) {
			if (data.getHours() == 0 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-24 ore al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/K4XVgc8z/Tavola-disegno-1.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 12 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-12 ore al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/RC3ZfP05/Tavola-disegno-1-copia.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 14 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-10 ore al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/Prwnf95J/Tavola-disegno-1-copia-2.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 19 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-5 ore al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/SQ5phkqH/Tavola-disegno-1-copia-3.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 21 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-3 ore al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/QMSRnr04/Tavola-disegno-1-copia-4.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 22 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-2 ore al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/Mp0kVBR8/Tavola-disegno-1-copia-5.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 23 && data.getMinutes() == 0) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-1 ora al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/SxbFndnr/Tavola-disegno-1-copia-6.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 23 && data.getMinutes() == 30) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-30 minuti al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/pT63RJNK/Tavola-disegno-1-copia-7.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 23 && data.getMinutes() == 45) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-15 minuti al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/Pxx0gF7t/Tavola-disegno-1-copia-8.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 23 && data.getMinutes() == 55) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-5 minuti al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/YSt53SfL/Tavola-disegno-1-copia-9.png")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getHours() == 23 && data.getMinutes() == 59) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-1 minuto al 2022")
					.setColor("#F7931E")
					.setImage("https://i.postimg.cc/hvQ6jQg6/Tavola-disegno-1-copia-10.png")
				client.channels.cache.get(idCanale).send(embed)
			}
		}
		else if (data.getDate() == numdata2 && data.getHours() == 0 && data.getMinutes() == 0) {
			var embed = new Discord.MessageEmbed()
				.setTitle("BUON 2022 a tutti!")
				.setColor("#F7931E")
				.setImage("https://i.postimg.cc/ryvF9Sdd/Tavola-disegno-1-copia-11.png")
			client.channels.cache.get(idCanale).send(embed)
		}
	}
	else {
		if (data.getDate() == numdata && data.getHours() == 23 && data.getMinutes() == 59) {
			if (data.getSeconds() == 50) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-10")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 51) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-9")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 52) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-8")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 53) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-7")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 54) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-6")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 55) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-5")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 56) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-4")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 57) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-3")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 58) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-2")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
			if (data.getSeconds() == 59) {
				var embed = new Discord.MessageEmbed()
					.setTitle("-1")
					.setColor("#F7931E")
				client.channels.cache.get(idCanale).send(embed)
			}
		}
	}
}, 1000)