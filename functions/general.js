const { getInfo } = require('ytdl-getinfo');
const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont("./canvas/font/roboto.ttf", { family: "roboto" })
registerFont("./canvas/font/robotoBold.ttf", { family: "robotoBold" })
const { fillTextWithTwemoji } = require('canvas-with-twemoji');

global.utenteMod = function (member) {
	if (!member?.id) return

	for (const [name, idRuolo] of Object.entries(settings.ruoliStaff)) {
		if (client.guilds.cache.get(settings.idServer).members.cache.find((x) => x.id == member.id)?.roles.cache.has(idRuolo))
			return true;
	}
	return false;
};

global.codeError = async function (err) {
	console.log(err);

	if (err.toString().startsWith("Response: Internal Server Error") || err.stack.toString().startsWith("Response: Internal Server Error") ||
		err.toString().startsWith("DiscordAPIError: Cannot send an empty message") || err.stack.toString().startsWith("DiscordAPIError: Cannot send an empty message")
	) return

	var embed = new Discord.MessageEmbed()
		.setTitle(`ERROR`)
		.setThumbnail(`https://images-ext-1.discordapp.net/external/8DoN43XFJZCFvTRZXpq443nx7s0FaLVesjgSNnlBTec/https/i.postimg.cc/zB4j8xVZ/Error.png?width=630&height=630`)
		.setColor(`#ED1C24`)
		.addField(':alarm_clock: Time', `${moment(new Date().getTime()).format('ddd DD MMM YYYY, HH:mm:ss')}`)
		.addField(':name_badge: Error', err.stack ? `${err.stack.slice(0, 900)}` : `${err.slice(0, 900)}`);

	var button1 = new Discord.MessageButton()
		.setLabel("Elimina")
		.setCustomId("eliminaError")
		.setStyle("DANGER")

	var button2 = new Discord.MessageButton()
		.setLabel("Elimina tutti")
		.setCustomId("eliminaTuttiError")
		.setStyle("DANGER")

	var row = new Discord.MessageActionRow()
		.addComponents(button1)
		.addComponents(button2)

	if (!isMaintenance())
		client.channels.cache.get(log.general.codeErrors).send({ embeds: [embed], components: [row] });
};

global.humanize = function (number) {
	if (!number) return "0"
	number = parseInt(number)
	return number.toString().split("").reverse().join("").match(/.{1,3}/g).join(".").split("").reverse().join("")
}

global.makeBackup = async function () {
	if (settings.inMaintenanceMode) return

	var data = new Date();
	if (data.getHours() == 2 && data.getMinutes() == 0 && data.getSeconds() == 0) {
		var server = client.guilds.cache.get(settings.idServer);

		var backup = {
			info: {
				time: new Date().getTime(),
				moderator: '793768313934577664'
			},
			guild: {
				name: '',
				description: '',
				icon: '',
				banner: '',
				bans: [],
				emojis: [],
				rulesChannel: '',
				systemChannel: '',
				publicUpdatesChannel: '',
				verificationLevel: ''
			},
			categories: [],
			channels: [],
			roles: [],
			thingsToDo: []
		};

		//SERVER
		backup.guild.name = server.name;
		backup.guild.description = server.description;
		backup.guild.icon = server.iconURL();
		backup.guild.banner = server.bannerURL();
		await server.bans.fetch().then((banned) => {
			banned.forEach(ban => backup.guild.bans.push(ban.user.id));
		});
		if (server.emojis)
			await server.emojis.cache.forEach((emoji) =>
				backup.guild.emojis.push({
					name: emoji.name,
					url: `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=96`
				})
			);
		backup.guild.rulesChannel = server.rulesChannelId;
		backup.guild.systemChannel = server.systemChannelId;
		backup.guild.publicUpdatesChannel = server.publicUpdatesChannelId;
		backup.guild.verificationLevel = server.verificationLevel;

		//CATEGORY
		var categories = await server.channels.cache.filter((x) => x.type == "GUILD_CATEGORY").sort((a, b) => a.position - b.position);
		for (var categoria of categories) {
			categoria = categoria[1]
			backup.categories.push(categoria.name);
		}

		//CHANNELS
		var canali = await server.channels.cache.filter((x) => x.type != "GUILD_CATEGORY").sort((a, b) => a.position - b.position);
		for (var canale of canali) {
			var canale = canale[1]

			var info = {
				name: canale.name,
				type: canale.type,
				topic: canale.topic,
				slowmode: canale.rateLimitPerUser,
				bitrate: canale.bitrate,
				userlimit: canale.topic,
				category: canale.parentId,
				permissions: canale.permissionOverwrites,
				messages: []
			};
			if (canale.messages) {
				await canale.messages.fetch({ limit: 50 }).then(async (messages) => {
					await messages.forEach(async (msg) => {
						if (!msg.system) {
							await info.messages.push({
								author: {
									username: msg.author.username,
									id: msg.author.id,
									avatar: msg.author.displayAvatarURL({
										dynamic: true,
										format: 'png',
										size: 1024
									})
								},
								content: msg.content,
								embed: msg.embeds,
								attachments: msg.attachments,
								components: msg.components,
								isPinned: msg.pinned
							});
						}
					});
				});
			}

			await backup.channels.push(info);
		}

		//ROLES
		var ruoli = server.roles.cache.sort((a, b) => b.position - a.position);
		for (var ruolo of ruoli) {
			ruolo = ruolo[1]
			var info = {
				name: ruolo.name,
				color: ruolo.color,
				members: ruolo.members.map((m) => m.user.id),
				hoist: ruolo.hoist,
				mentionable: ruolo.mentionable,
				permissions: ruolo.permissions
			};

			backup.roles.push(info);
		}

		//THINGS TO DO
		var messages = await client.channels.cache.get(log.general.thingsToDo).messages.fetch();
		messages = messages

		for (var thing of messages) {
			thing = thing[1]
			var ttd = {
				content: thing.embeds[0].fields[1].value,
				status:
					thing.embeds[0].fields[0].value == '```⚪ Uncompleted```'
						? 0
						: thing.embeds[0].fields[0].value == '```🔴 Urgent```'
							? 1
							: thing.embeds[0].fields[0].value == '```🟢 Completed```'
								? 2
								: thing.embeds[0].fields[0].value == '```🔵 Tested```'
									? 3
									: thing.embeds[0].fields[0].value == '```⚫ Finished```' ? 4 : ''
			};

			backup.thingsToDo.push(ttd);
		}

		var attachment1 = await new Discord.MessageAttachment(
			Buffer.from(JSON.stringify(userstatsList, null, '\t'), "utf-8"),
			`userstats-${new Date().getDate()}${new Date().getMonth() +
			1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.json`
		);
		var attachment2 = await new Discord.MessageAttachment(
			Buffer.from(JSON.stringify(serverstats, null, '\t'), "utf-8"),
			`serverstats${new Date().getDate()}${new Date().getMonth() +
			1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.json`
		);
		var attachment3 = await new Discord.MessageAttachment(
			Buffer.from(JSON.stringify(backup, null, '\t'), "utf-8"),
			`backup${new Date().getDate()}${new Date().getMonth() +
			1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.json`
		);

		var embed = new Discord.MessageEmbed()
			.setTitle(':inbox_tray: Auto backup :inbox_tray:')
			.setColor('#757575')
			.addField("Time", moment().format("dddd DD MMMM, HH:mm:ss"))

		var canale = client.channels.cache.get(log.general.backup);
		canale.send({ embeds: [embed], files: [attachment1, attachment2, attachment3] });
	}
};

global.updateServerstats = function () {
	database.collection('serverstats').updateOne({}, { $set: serverstats });
}
global.updateUserstats = function () {
	database.collection('userstats').find().toArray(function (err, result) {
		userstatsList.forEach((element) => {
			var userstats = result.find((x) => x.id == element.id);
			if (!userstats) return;

			if (JSON.stringify(userstats) != JSON.stringify(element)) {
				element._id = userstats._id;
				database.collection('userstats').updateOne({ id: element.id }, { $set: element });
			}
		});
	});
}

global.youtubeNotification = function () {
	if (settings.inMaintenanceMode) return

	ytch.getChannelVideos('UCK6QwAdGWOWN9AT1_UQFGtA', 'newest').then(async (response) => {
		var idVideo = response.items[0]?.videoId;
		if (!idVideo) return

		client.channels.cache.get('869975176895418438').messages.fetch().then(async (messages) => {
			var isGiaMandato = false;
			await messages.forEach((msg) => {
				if (
					msg.content.split('\n')[msg.content.split('\n').length - 2] &&
					msg.content.split('\n')[msg.content.split('\n').length - 2].endsWith(idVideo)
				)
					isGiaMandato = true;
			});

			if (!isGiaMandato) {
				await getInfo(`https://www.youtube.com/watch?v=${idVideo}`).then(async (info) => {
					var descriptionVideo = await JSON.stringify(info.items[0].description).split('\\n\\n')[0].slice(1);

					await client.channels.cache.get('869975176895418438').send(`
-------------💻 **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** 💻-------------
Ehy ragazzi, è appena uscito un nuovo video su **GiulioAndCode**
Andate subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
<@&${settings.ruoliNotification.youtubeVideosCode}>
                `);
				});
			}
		});
	});

	ytch.getChannelVideos('UCvIafNR8ZvZyE5jVGVqgVfA', 'newest').then(async (response) => {
		var idVideo = response.items[0]?.videoId;
		if (!idVideo) return

		client.channels.cache.get('869975176895418438').messages.fetch().then(async (messages) => {
			var isGiaMandato = false;
			await messages.forEach((msg) => {
				if (
					msg.content.split('\n')[msg.content.split('\n').length - 2] &&
					msg.content.split('\n')[msg.content.split('\n').length - 2].endsWith(idVideo)
				)
					isGiaMandato = true;
			});

			if (!isGiaMandato) {
				await getInfo(`https://www.youtube.com/watch?v=${idVideo}`).then(async (info) => {
					var descriptionVideo = await JSON.stringify(info.items[0].description).split('\\n\\n')[0].slice(1);

					await client.channels.cache.get('869975176895418438').send(`
-------------✌ **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** ✌-------------
Ehy ragazzi, è appena uscito un nuovo video su **Giulio**
Andate subito a vedere \"**${info.items[0].fulltitle}**\"

${descriptionVideo}

https://youtu.be/${idVideo}
<@&${settings.ruoliNotification.youtubeVideosGiulio}>
                `);
				});
			}
		});
	});
}

global.botCommandMessage = async function (message, type, title, description, comando, fields, components) {
	var canvas = await getCanvasMessage(message, type)

	var embed = new Discord.MessageEmbed()
		.setImage("attachment://canvas.png")

	if (type == "ComandoNonEsistente") {
		embed
			.setTitle("Comando non esistente")
			.setColor("#FF931E")
			.setDescription("Questo comando non esiste\r_Usa `!help` per avere l'elenco di tutti i comandi disponibili_")
	}
	else if (type == "Error") {
		embed
			.setTitle(title)
			.setColor("#ed3737")
			.setDescription(`${description}\r_Sinstassi comando: \`${comando.syntax}\`_`)

		var command = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
		var embed2 = new Discord.MessageEmbed()
			.setTitle(":no_entry: Error :no_entry:")
			.setColor("#ed3737")
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
			.addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
			.addField("Channel", `#${message.channel.name}`, false)
			.addField("Command", `!${command}`, false)
		if (`!${command}` != message.content)
			embed2.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

		embed2
			.addField("Error message", `${description}`, false)

		if (!isMaintenance())
			client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
	}
	else if (type == "Warning") {
		embed
			.setTitle(title)
			.setColor("#919191")
			.setDescription(description)

		if (fields) {
			fields.forEach(field => {
				embed
					.addField(field.name || "\u200b", field.value)
			})
		}

		var command = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
		var embed2 = new Discord.MessageEmbed()
			.setTitle(":grey_exclamation: Warning :grey_exclamation:")
			.setColor("#919191")
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
			.addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
			.addField("Channel", `#${message.channel.name}`, false)
			.addField("Command", `!${command}`, false)
		if (`!${command}` != message.content)
			embed2.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

		if (description)
			embed2
				.addField("Error message", `${description}`, false)

		if (!isMaintenance())
			client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
	}
	else if (type == "Correct") {
		embed
			.setTitle(title)
			.setColor("#13afe8")
			.setDescription(description)
	}
	else if (type == "NonPermesso") {
		embed
			.setTitle("Non hai il permesso")
			.setColor("#8132f0")
			.setDescription(description ? description : `Non hai i permessi necessari per utilizzare questo comando`)

		var command = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
		var embed2 = new Discord.MessageEmbed()
			.setTitle(":crossed_swords: Command not allowed :crossed_swords:")
			.setColor("#8132f0")
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
			.addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
			.addField("Channel", `#${message.channel.name}`, false)
			.addField("Command", `!${command}`, false)
		if (`!${command}` != message.content)
			embed2.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

		if (description)
			embed2
				.addField("Error message", `${description}`, false)

		if (!isMaintenance())
			client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
	}
	else if (type == "CanaleNonConcesso") {
		var canaliConcessiLista = "";
		comando.channelsGranted.forEach(idCanale => {
			canaliConcessiLista += `<#${idCanale}>\r`
		})

		var command = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
		embed
			.setTitle("Canale non concesso")
			.setColor("#e3b009")
			.setDescription(`Non puoi utilizzare il comando \`!${comando.name}\` in questo canale
${canaliConcessiLista ? `_Puoi utilizzare questo comando in:_\r${canaliConcessiLista}` : ""}`)

		var embed2 = new Discord.MessageEmbed()
			.setTitle(":construction: Channel not granted :construction:")
			.setColor("#e3b009")
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
			.addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
			.addField("Channel", `#${message.channel.name}`, false)
			.addField("Command", `!${command}`, false)
		if (`!${command}` != message.content)
			embed2.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

		if (!isMaintenance())
			client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
	}
	else if (type == "DMNonAbilitati") {
		embed
			.setTitle("DM non abilitati")
			.setColor("#e3b009")
			.setDescription(`Il comando \`!${comando.name}\` non abilitato nei DM del bot, usalo all'interno del server`)
	}

	if (components)
		message.channel.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')], components: components })
			.then(msg => {
				if (type != "Correct") {
					setTimeout(() => msg.delete().catch(() => { }), 20000)
					setTimeout(() => message.delete().catch(() => { }), 20000)
				}
			})
			.catch(() => { })
	else
		message.channel.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
			.then(msg => {
				if (type != "Correct") {
					setTimeout(() => msg.delete().catch(() => { }), 20000)
					setTimeout(() => message.delete().catch(() => { }), 20000)
				}
			})
			.catch(() => { })

	return true
}

global.botMessage = async function (channel, type, title, description, fields) {
	var embed = new Discord.MessageEmbed()

	switch (type) {
		case "Warning": {
			embed
				.setTitle(title)
				.setColor("#919191")
				.setDescription(description)
				.setThumbnail("https://i.postimg.cc/rsNgGW97/Warning2.png")

			if (fields)
				fields.forEach(field => {
					embed
						.addField(field.name, field.value)
				})
		} break
		case "Correct": {
			embed
				.setTitle(title)
				.setColor("#13afe8")
				.setDescription(description)
				.setThumbnail("https://i.postimg.cc/RZ5SzD3T/Correct2.png")
		}
	}



	channel.send({ embeds: [embed] })
		.then(msg => {
			if (type != "Correct") {
				setTimeout(() => msg.delete().catch(() => { }), 20000)
			}
		})
		.catch(() => { })
}

global.getCanvasMessage = async function (message, type) {
	if (type == "DMNonAbilitati") type = "CanaleNonConcesso"


	var messageContent = message.content;
	if (message.mentions.roles) {
		message.mentions.roles.forEach(role => {
			messageContent = messageContent.replace(`<@&${role.id}>`, `@${role.name}`)
		})
	}
	if (message.mentions.users) {
		message.mentions.users.forEach(user => {
			messageContent = messageContent.replace(`<@${user.id}>`, `@${client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == user.id)?.nickname ? client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == user.id).nickname : client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == user.id).user.username}`)
			messageContent = messageContent.replace(`<@!${user.id}>`, `@${client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == user.id)?.nickname ? client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == user.id).nickname : client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == user.id).user.username}`)
		})
	}
	if (message.mentions.channels) {
		message.mentions.channels.forEach(channel => {
			messageContent = messageContent.replace(`<#${channel.id}>`, `#${channel.name.replace("│", "|")}`)
		})
	}

	var canvas = await createCanvas(1920, 750)
	var ctx = await canvas.getContext('2d')

	var img = await loadImage(`./canvas/img/EmptyCanvas${Math.floor(Math.random() * (5) + 1)}.png`)
	ctx.drawImage(img, 0, 0)

	var textChannel = await createCanvas(1920, 70)
	var ctx2 = await textChannel.getContext('2d')

	ctx2.font = "63px roboto"
	ctx2.fillStyle = "#72767D";
	await fillTextWithTwemoji(ctx2, `Invia un messaggio in ${message.channel.type != "DM" ? `#${message.channel.name?.replace("│", "|")}` : `@GiulioAndCommunityBOT`}`, 10, 75);

	ctx.drawImage(textChannel, 345, 600)

	var avatar = await createCanvas(185, 185)
	var ctx3 = await avatar.getContext('2d')

	ctx3.beginPath();
	ctx3.arc(92.5, 92.5, 92.5, 0, Math.PI * 2, true);
	ctx3.closePath();
	ctx3.clip();

	var img = await loadImage(message.author.displayAvatarURL({ dynamic: false, size: 256, format: `png` }));
	ctx3.drawImage(img, 0, 0, 185, 185);

	ctx.drawImage(avatar, 119, 269)

	ctx.textBaseline = "top"

	ctx.font = "63px robotoBold"
	ctx.fillStyle = !message.member?.displayHexColor || message.member?.displayHexColor == "#000000" ? "#ffffff" : message.member?.displayHexColor;
	ctx.fillText(message.author.username, 364, 271);

	var widthName = ctx.measureText(message.author.username).width

	ctx.font = "63px roboto"
	ctx.fillStyle = "#ffffff";
	await fillTextWithTwemoji(ctx, messageContent.slice(0, 40), 364, 365);

	ctx.font = "47px roboto"
	ctx.fillStyle = "#72767D";

	var hours = new Date().getHours()
	var minutes = new Date().getMinutes()
	ctx.fillText(`Oggi alle ${hours < 10 ? ("0" + hours) : hours}:${minutes < 10 ? ("0" + minutes) : minutes}`, 364 + widthName + 30, 287);

	var img = await loadImage(`./canvas/img/${type}.png`);
	ctx.drawImage(img, canvas.width - 850, 0, 850, 850 * img.height / img.width);

	return canvas
}

global.deleteDBLeavedUsers = async function () {
	if (!userstatsList) return

	userstatsList.forEach(async userstats => {
		if (!client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == userstats.id)) {

			if (userstats.leavedAt && new Date().getTime() - userstats.leavedAt > (60 * 1000 * 60 * 24 * 28)) {
				var utente = await client.users.fetch(userstats.id)
					.catch(() => { })

				if (utente.user) utente = utente.user

				var embed = new Discord.MessageEmbed()
					.setTitle(":wastebasket: Userstats deleted :wastebasket:")
					.setColor("#e31705")
					.setThumbnail(utente.displayAvatarURL({ dynamic: true }))
					.addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
					.addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${userstats.id}`, false)
					.addField("Leaved server", `${moment(userstats.leavedAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(userstats.leavedAt).fromNow()})`, false)

				var attachment1 = await new Discord.MessageAttachment(
					Buffer.from(JSON.stringify(userstats, null, '\t'), "utf-8"), `userstats${userstats.id}-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.json`
				);

				client.channels.cache.get(log.server.other).send({ embeds: [embed], files: [attachment1] })

				userstatsList = userstatsList.filter(x => x.id != userstats.id)
				database.collection("userstats").deleteOne({ id: userstats.id })
			}
		}
	})
}

global.toHex = function (number) {
	const r = (number & 0xff0000) >> 16;
	const g = (number & 0x00ff00) >> 8;
	const b = (number & 0x0000ff);

	return toHex(r, g, b)

	function toHex(red, green, blue) {
		function colorToHex(color) {
			var hexadecimal = color.toString(16);
			return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
		}

		return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
	}
}

global.getGuild = async function () {
	return await client.guilds.cache.get(settings.idServer)
}
global.getUser = async function (value, value2) {
	if (!value) return
	value = value.toLowerCase()

	var guild = await getGuild();
	if (!guild) return

	var utente = await guild.members.cache.get(value) || await guild.members.cache.find(user => user.user.username.toLowerCase() == value) || await guild.members.cache.find(user => user.user.tag.toLowerCase() == value) || await guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == value)
	if (utente) return utente

	var utente = await client.users.cache.get(value) || await client.users.cache.find(user => user.username?.toLowerCase() == value || user.user?.username.toLowerCase() == value) || await client.users.cache.find(user => user.tag?.toLowerCase() == value || user.user?.tag.toLowerCase() == value) || await client.users.cache.find(user => user.nickname && user.nickname.toLowerCase() == value)
	if (utente) return utente

	var utente = await client.users.fetch(value)
		.catch(() => { })

	if (utente) return utente

	if (!value2) return
	value2 = value2.toLowerCase()

	var utente = await guild.members.cache.get(value2) || await guild.members.cache.find(user => user.user.username.toLowerCase() == value2) || await guild.members.cache.find(user => user.user.tag.toLowerCase() == value2) || await guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == value2)
	if (utente) return utente

	var utente = await client.users.cache.get(value2) || await client.users.cache.find(user => user.username?.toLowerCase() == value2 || user.user?.username.toLowerCase() == value2) || await client.users.cache.find(user => user.tag?.toLowerCase() == value2 || user.user?.tag.toLowerCase() == value2) || await client.users.cache.find(user => user.nickname && user.nickname.toLowerCase() == value2)
	if (utente) return utente

	var utente = await client.users.fetch(value2)
		.catch(() => { })

	if (utente) return utente
}

global.checkActivityPrivateRooms = function () {
	for (var index in serverstats.privateRooms) {
		var room = serverstats.privateRooms[index]

		if (room.lastActivity && room.lastActivityCount == 0 && new Date().getTime() - room.lastActivity >= 604800000) {
			var embed = new Discord.MessageEmbed()
				.setTitle("Stanza un po' inattiva")
				.setColor("#FFAC33")
				.setDescription("La tua stanza privata è inutilizzata da più di **7 giorni**\rTra una settimana verrà eliminata se risulterà ancora inattiva. Premi sul pulsante **\"Annulla eliminazione\"** per poter continuare ad usarla")

			var button1 = new Discord.MessageButton()
				.setLabel("Annulla eliminazione")
				.setStyle("DANGER")
				.setCustomId(`annullaEliminazione`)

			var row = new Discord.MessageActionRow()
				.addComponents(button1)

			if (room.text) {
				client.channels.cache.get(room.text)?.send(`<@${room.owner}>`)
					.then(msg => msg.delete().catch(() => { }))

				client.channels.cache.get(room.text)?.send({ embeds: [embed], components: [row] })
					.catch(() => { })
			}
			else {
				client.users.cache.get(room.owner)?.send({ embeds: [embed], components: [row] })
					.catch(() => { })
			}

			serverstats.privateRooms[index].lastActivity = new Date().getTime()
			serverstats.privateRooms[index].lastActivityCount = 1
		}
		if (room.lastActivity && room.lastActivityCount == 1 && new Date().getTime() - room.lastActivity >= 604800000) {
			var embed = new Discord.MessageEmbed()
				.setTitle("Stanza molto inattiva")
				.setColor("#FFAC33")
				.setDescription("La tua stanza privata è inutilizzata da più di **14 giorni**\rTra meno di un minuto verrà **eliminata**. Premi sul pulsante **\"Annulla eliminazione\"** per poter continuare ad usarla")

			var button1 = new Discord.MessageButton()
				.setLabel("Annulla eliminazione")
				.setStyle("DANGER")
				.setCustomId(`annullaEliminazione`)

			var row = new Discord.MessageActionRow()
				.addComponents(button1)

			if (room.text) {
				client.channels.cache.get(room.text).send(`<@${room.owner}>`)
					.then(msg => msg.delete().catch(() => { }))

				client.channels.cache.get(room.text).send({ embeds: [embed], components: [row] })

				client.channels.cache.get(room.text).messages.fetch()
					.then(messages => {
						var msg = messages.find(x => x.embeds[0]?.title == "Stanza un po' inattiva")
						if (msg) msg.delete().catch(() => { })
					})
			}
			else {
				client.users.cache.get(room.owner).send({ embeds: [embed], components: [row] })
					.catch(() => { })
			}

			serverstats.privateRooms[index].lastActivity = new Date().getTime()
			serverstats.privateRooms[index].lastActivityCount = 2
		}
		if (room.lastActivity && room.lastActivityCount == 2 && new Date().getTime() - room.lastActivity >= 60000) {
			if (room.text && client.channels.cache.get(room.text))
				client.channels.cache.get(room.text).delete()
					.catch(() => { })
			if (room.voice && client.channels.cache.get(room.voice))
				client.channels.cache.get(room.voice).delete()
					.catch(() => { })

			serverstats.privateRooms = serverstats.privateRooms.filter(x => x.owner != room.owner)
		}
	}
}

global.statsVocal = function () {
	var date = new Date();
	if (date.getFullYear() != 2022) return

	if (settings.inMaintenanceMode) return
	if (!userstatsList) return

	var server = client.guilds.cache.get(settings.idServer)
	server.channels.cache.filter(x => x.type == "GUILD_VOICE").forEach(channel => {
		channel.members.forEach(member => {

			var userstats = userstatsList.find(x => x.id == member.id);
			if (!userstats) return

			if (!userstats.wrapped) {
				userstats.wrapped = {
					"startTime": date.getTime(),
					"messages": {},
					"channels": {},
					"reactions": {},
					"words": {},
					"emojis": {},
					"commands": {},
					"vocalChannelsSeconds": 0,
					"startLevel": userstats.level,
					"startMoney": userstats.money ? userstats.money : 0,
				}
			}

			userstats.wrapped.vocalChannelsSeconds = userstats.wrapped.vocalChannelsSeconds + 1

			userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
		});
	})
}

global.checkBirthday = async function () {
	if (!userstatsList) return

	var data = new Date()

	var birthdayToday = []

	userstatsList.forEach(userstats => {
		if (userstats.birthday && ((userstats.birthday[0] == data.getMonth() + 1 && userstats.birthday[1] == data.getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && data.getMonth() == 2 && data.getDate() == 1 && !isAnnoBisestile(new Date().getFullYear())))) {
			birthdayToday.push(userstats)
		}
	})

	if (birthdayToday.length > 0) {
		if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
			var canvas = await createCanvas(400, 400)
			var ctx = await canvas.getContext('2d')

			var img = await loadImage("./canvas/img/birthdayToday.png")
			ctx.drawImage(img, 0, 0)

			ctx.textBaseline = 'middle';
			ctx.font = "75px robotoBold"
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase()).width / 2, 105);

			ctx.font = "185px robotoBold"
			ctx.fillStyle = "#303030";
			ctx.fillText(data.getDate(), canvas.width / 2 - ctx.measureText(data.getDate()).width / 2, 247);

			var img = await loadImage("./canvas/img/birthdayDecorations.png")
			ctx.drawImage(img, 0, 0)

			birthdayToday.forEach(async userstats => {
				if (client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == userstats.id)) {
					var items = require("../config/items.json")
					var randomItems = []
					for (var i = 1; i <= 4; i++) {
						randomItems.push(items[Math.floor(Math.random() * items.length)])
						items = items.filter(x => x != randomItems[randomItems.length - 1])
					}

					var embed = new Discord.MessageEmbed()
						.setTitle(":tada: Happy birthday! :tada:")
						.setColor("#FF1180")
						.setThumbnail("attachment://canvas.png")
						.setDescription("Tanti auguri di **buon compleanno**, goditi subito questi fantastici **regali**")
						.addField(":gift: I tuoi regali", `
- +${userstats.level * 40} XP
- +${userstats.level * 10} Coins
- 4 oggetti random dallo **shop** ${randomItems.map(x => x.icon).join(" ")}
- **Boost x2** livellamento per tutto il giorno`)

					client.users.cache.get(userstats.id).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
						.catch(() => { })

					userstats = await addXp(userstats, userstats.level * 40, 0);
					userstats.coins += userstats.level * 10
					randomItems.forEach(item => {
						userstats.inventory[item.id] = !userstats.inventory[item.id] ? 1 : (userstats.inventory[item.id] + 1)
					})

					userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
				}
			})
		}
		if (data.getHours() == 8 && data.getMinutes() == 0 && data.getSeconds() == 0) {
			var canvas = await createCanvas(400, 400)
			var ctx = await canvas.getContext('2d')

			var img = await loadImage("./canvas/img/birthdayToday.png")
			ctx.drawImage(img, 0, 0)

			ctx.textBaseline = 'middle';
			ctx.font = "75px robotoBold"
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase(), canvas.width / 2 - ctx.measureText(moment([2000, data.getMonth(), data.getDate()]).format("MMM").toUpperCase()).width / 2, 105);

			ctx.font = "185px robotoBold"
			ctx.fillStyle = "#303030";
			ctx.fillText(data.getDate(), canvas.width / 2 - ctx.measureText(data.getDate()).width / 2, 247);

			var img = await loadImage("./canvas/img/birthdayDecorations.png")
			ctx.drawImage(img, 0, 0)

			var embed = new Discord.MessageEmbed()
				.setTitle(":tada: Happy birthday! :tada:")
				.setColor("#FF1180")
				.setThumbnail("attachment://canvas.png")

			if (birthdayToday.length == 1) {
				embed
					.setDescription(`Oggi è il compleanno di ${client.users.cache.get(birthdayToday[0].id).toString()}\rFategli tanti **auguri** e tanti **regali**`)
			}
			else {
				var textUsers = ""
				for (var i = 0; i < birthdayToday.length - 1; i++)
					textUsers += `${client.users.cache.get(birthdayToday[i].id).toString()}, `

				if (textUsers != "") textUsers = textUsers.slice(0, -2)

				textUsers += ` e ${client.users.cache.get(birthdayToday[birthdayToday.length - 1].id).toString()}`

				embed
					.setDescription(`Oggi è il compleanno di ${textUsers}\rFate a tutti tanti **auguri** e tanti **regali**`)
			}

			client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })

			var textUsers = ""
			birthdayToday.forEach(userstats => {
				textUsers += `- ${client.users.cache.get(userstats.id).toString()}\r`
			})

			var embed = new Discord.MessageEmbed()
				.setTitle(":gift: Birthdays today :gift:")
				.setColor("#8227cc")
				.addField(":alarm_clock: Day", `${moment(data.getTime()).format("ddd DD MMM YYYY")}`, false)
				.addField("Birthdays", textUsers)

			client.channels.cache.get(log.birthday.birthdaysToday).send({ embeds: [embed] })
		}

	}
}

global.checkRoomInDB = function () {
	serverstats.privateRooms.forEach(room => {
		if (room.text) {
			if (!client.channels.cache.get(room.text)) serverstats.privateRooms = serverstats.privateRooms.filter(x => x.text != room.text)
		}
		if (room.voice) {
			if (!client.channels.cache.get(room.voice)) serverstats.privateRooms = serverstats.privateRooms.filter(x => x.voice != room.voice)
		}
	})

	client.guilds.cache.get(settings.idServer).channels.cache.forEach(channel => {
		if (channel.parentId == settings.idCanaliServer.categoriaPrivateRooms && channel.id != settings.idCanaliServer.privateRooms) {
			if (channel.type == "GUILD_TEXT") {
				if (!serverstats.privateRooms.find(x => x.text == channel.id)) channel.delete().catch(() => { })
			}
			if (channel.type == "GUILD_VOICE") {
				if (!serverstats.privateRooms.find(x => x.voice == channel.id)) channel.delete().catch(() => { })
			}
		}
	})
}

global.isMaintenance = function (idUtente) {
	if (!idUtente) {
		if (process.env.maintenance != "1" && process.env.maintenance != "2") return false
		else return true
	}

	var isTester = false
	if (idUtente == settings.idGiulio) isTester = true
	if (idUtente == settings.idGiulio2) isTester = true
	if (idUtente == settings.idGiulioFake) isTester = true

	if (process.env.maintenance == "1") //Solo i Tester possono interagire con il Bot
		if (!isTester) return true

	if (process.env.maintenance == "2") //Nessuno può interagire con il Bot
		return true

	if (process.env.maintenance == "3") //Tutti tranne i Tester possono interagine con il Bot
		if (isTester) return true

	return false
}

global.isAnnoBisestile = function (year) {
	year = parseInt(year)
	if (!year) return

	return moment([year]).isLeapYear()
}
global.prossimoBirthday = function (month, day) {
	var year;

	if (month == 2 && day == 29) {
		if (isAnnoBisestile(new Date().getFullYear())) {
			if (moment([new Date().getFullYear(), month - 1, day]).diff(moment()) > 0) {
				year = new Date().getFullYear()
			}
			else {
				year = new Date().getFullYear() + 1
				month = 3
				day = 1
			}
		}
		else {
			if (moment([new Date().getFullYear(), 2, 1]).diff(moment()) > 0) {
				year = new Date().getFullYear()
				month = 3
				day = 1
			}
			else {
				if (!isAnnoBisestile(new Date().getFullYear() + 1)) {
					month = 3
					day = 1
				}
				year = new Date().getFullYear() + 1
			}
		}
	}

	if (moment([new Date().getFullYear(), month - 1, day]).diff(moment()) > 0) {
		year = new Date().getFullYear()
	}
	else {
		year = new Date().getFullYear() + 1
	}

	return [year, month - 1, day]
}

global.checkTicketInDB = function () {
	serverstats.ticket.forEach(ticket => {
		if (!client.guilds.cache.get(settings.idServer).channels.cache.find(x => x.id == ticket.channel)) serverstats.ticket = serverstats.ticket.filter(x => x.channel != ticket.channel)
	})
}
