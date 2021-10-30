const { getInfo } = require('ytdl-getinfo');

global.utenteMod = function (member) {
	for (const [name, idRuolo] of Object.entries(config.ruoliStaff)) {
		if (
			client.guilds.cache
				.get(config.idServer)
				.members.cache.find((x) => x.id == member.id)
				.roles.cache.has(idRuolo)
		)
			return true;
	}
	return false;
};

global.codeError = function (err) {
	var embed = new Discord.MessageEmbed()
		.setTitle(`ERROR`)
		.setThumbnail(
			`https://images-ext-1.discordapp.net/external/8DoN43XFJZCFvTRZXpq443nx7s0FaLVesjgSNnlBTec/https/i.postimg.cc/zB4j8xVZ/Error.png?width=630&height=630`
		)
		.setColor(`#ED1C24`)
		.addField(
			':alarm_clock: Time',
			'```' + `${moment(new Date().getTime()).format('ddd DD MMM, HH:mm:ss')}` + '```'
		)
		.addField(':name_badge: Error', err.stack ? `\`\`\`${err.stack.slice(0, 900)}\`\`\`` : `\`\`\`${err.slice(0, 900)}\`\`\``);

	client.channels.cache.get(log.codeErrors).send(embed);
	console.log(err);
};
global.permesso = function (message, comando) {
	var embed = new Discord.MessageEmbed()
		.setTitle(`Non hai il permesso`)
		.setColor(`#9E005D`)
		.setDescription(`Non puoi eseguire il comando \`${comando}\` perchè non hai il permesso`);

	var data = new Date();
	if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
		embed.setThumbnail('https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png');
	} else {
		embed.setThumbnail('https://i.postimg.cc/D0scZ1XW/No-permesso.png');
	}

	message.channel.send(embed).then((msg) => {
		message.delete({ timeout: 20000 }).catch(() => { });
		msg.delete({ timeout: 20000 }).catch(() => { });
	});
};
global.error = function (message, title, description) {
	var embed = new Discord.MessageEmbed().setTitle(title).setColor(`#ED1C24`).setDescription(description);

	var data = new Date();
	if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
		embed.setThumbnail('https://i.postimg.cc/xdPRX9NF/Error-Halloween.png');
	} else {
		embed.setThumbnail('https://i.postimg.cc/zB4j8xVZ/Error.png');
	}

	message.channel.send(embed).then((msg) => {
		message.delete({ timeout: 20000 }).catch(() => { });
		msg.delete({ timeout: 20000 }).catch(() => { });
	});
};
global.warning = function (message, title, description) {
	var embed = new Discord.MessageEmbed()
		.setTitle(title)
		.setColor(`#8F8F8F`)
		.setDescription(description)
		.setThumbnail(`https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png`);

	message.channel.send(embed).then((msg) => {
		message.delete({ timeout: 20000 }).catch(() => { });
		msg.delete({ timeout: 20000 }).catch(() => { });
	});
};
global.correct = function (message, title, description) {
	var embed = new Discord.MessageEmbed().setTitle(title).setColor(`#16A0F4`).setDescription(description);

	var data = new Date();
	if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
		embed.setThumbnail('https://i.postimg.cc/NFXTGVdf/Correct-Halloween.png');
	} else {
		embed.setThumbnail('https://i.postimg.cc/SRpBjMg8/Giulio.png');
	}

	message.channel.send(embed)
};

global.makeBackup = async function () {
	var data = new Date();
	if (data.getHours() == 12 && data.getMinutes() == 0 && data.getSeconds() == 0) {
		var server = client.guilds.cache.get(config.idServer);

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
		await server.fetchBans().then((banned) => {
			banned.array().forEach((ban) => backup.guild.bans.push(ban.user.id));
		});
		if (server.emojis)
			await server.emojis.cache.array().forEach((emoji) =>
				backup.guild.emojis.push({
					name: emoji.name,
					url: `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=96`
				})
			);
		backup.guild.rulesChannel = server.rulesChannelID;
		backup.guild.systemChannel = server.systemChannelID;
		backup.guild.publicUpdatesChannel = server.publicUpdatesChannelID;
		backup.guild.verificationLevel = server.verificationLevel;

		//CATEGORY
		var categories = await server.channels.cache
			.array()
			.filter((x) => x.type == 'category')
			.sort((a, b) => a.position - b.position);
		for (var categoria of categories) {
			backup.categories.push(categoria.name);
		}

		//CHANNELS
		var canali = await server.channels.cache
			.array()
			.filter((x) => x.type != 'category')
			.sort((a, b) => a.position - b.position);
		for (var canale of canali) {
			var info = {
				name: canale.name,
				type: canale.type,
				topic: canale.topic,
				slowmode: canale.rateLimitPerUser,
				bitrate: canale.bitrate,
				userlimit: canale.topic,
				category: canale.parentID,
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
		var ruoli = server.roles.cache
			.array()
			.filter((x) => x.type != 'category')
			.sort((a, b) => b.position - a.position);
		for (var ruolo of ruoli) {
			var info = {
				name: ruolo.name,
				color: ruolo.color,
				members: ruolo.members.map((m) => m.user.id),
				hoist: ruolo.hoist,
				mentionable: ruolo.mentionable,
				permissions: ruolo.permissions
			};

			await backup.roles.push(info);
		}

		//THINGS TO DO
		var messages = await client.channels.cache.get(log.thingsToDo).messages.fetch();
		messages = messages.array();

		for (var thing of messages) {
			var ttd = {
				content: thing.embeds[0].fields[1].value,
				status:
					thing.embeds[0].fields[0].value == '```⚪Uncompleted```'
						? 0
						: thing.embeds[0].fields[0].value == '```🔴Urgent```'
							? 1
							: thing.embeds[0].fields[0].value == '```🟢Completed```'
								? 2
								: thing.embeds[0].fields[0].value == '```🔵Tested```'
									? 3
									: thing.embeds[0].fields[0].value == '```⚫Finished```' ? 4 : ''
			};

			backup.thingsToDo.push(ttd);
		}

		var attachment1 = await new Discord.MessageAttachment(
			Buffer.from(JSON.stringify(userstatsList, null, '\t')),
			`userstats-${new Date().getDate()}${new Date().getMonth() +
			1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.json`
		);
		var attachment2 = await new Discord.MessageAttachment(
			Buffer.from(JSON.stringify(serverstats, null, '\t')),
			`serverstats${new Date().getDate()}${new Date().getMonth() +
			1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.json`
		);
		var attachment3 = await new Discord.MessageAttachment(
			Buffer.from(JSON.stringify(backup, null, '\t')),
			`backup${new Date().getDate()}${new Date().getMonth() +
			1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.json`
		);

		var embed = new Discord.MessageEmbed()
			.setTitle(':inbox_tray: Auto backup :inbox_tray:')
			.setColor('#757575')
			.addField('Time', '```' + moment().format('dddd DD MMMM, HH:mm:ss') + '```');

		var canale = client.channels.cache.get(log.backup);
		canale.send({ embed, files: [attachment1, attachment2, attachment3] });
	}
};

global.updateServerstats = function () {
	database.collection('serverstats').updateOne({}, { $set: serverstats });
};
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
};

global.youtubeNotification = function () {
	ytch.getChannelVideos('UCK6QwAdGWOWN9AT1_UQFGtA', 'newest').then(async (response) => {
		var idVideo = response.items[0].videoId;
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
<@&${config.ruoliNotification.youtubeVideosCode}>
                `);
				});
			}
		});
	});

	ytch.getChannelVideos('UCvIafNR8ZvZyE5jVGVqgVfA', 'newest').then(async (response) => {
		var idVideo = response.items[0].videoId;
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
<@&${config.ruoliNotification.youtubeVideosGiulio}>
                `);
				});
			}
		});
	});
};
