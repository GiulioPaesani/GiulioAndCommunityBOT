module.exports = {
    name: "backup",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        var embed = new Discord.MessageEmbed()
            .setTitle("<a:Gear0:898966384598474752> BACKUP in corso - 0% <a:Gear0:898966384598474752>")
            .setDescription("Attendi un attimo, sto facendo un backup di tutto il **server** e del contenuto del **database**")
            .setColor("#fcba03")

        message.channel.send(embed)
            .then(async msg => {
                var server = client.guilds.cache.get(config.idServer)

                var backup = {
                    info: {
                        time: new Date().getTime(),
                        moderator: "793768313934577664"
                    },
                    guild: {
                        name: "",
                        description: "",
                        icon: "",
                        banner: "",
                        bans: [],
                        emojis: [],
                        rulesChannel: "",
                        systemChannel: "",
                        publicUpdatesChannel: "",
                        verificationLevel: ""
                    },
                    categories: [],
                    channels: [],
                    roles: [],
                    thingsToDo: []
                }

                //SERVER
                backup.guild.name = server.name
                backup.guild.description = server.description
                backup.guild.icon = server.iconURL()
                backup.guild.banner = server.bannerURL()
                await server.fetchBans()
                    .then(banned => {
                        banned.array().forEach(ban => backup.guild.bans.push(ban.user.id))
                    })
                if (server.emojis)
                    await server.emojis.cache.array().forEach(emoji => backup.guild.emojis.push({
                        name: emoji.name,
                        url: `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=96`
                    }))
                backup.guild.rulesChannel = server.rulesChannelID
                backup.guild.systemChannel = server.systemChannelID
                backup.guild.publicUpdatesChannel = server.publicUpdatesChannelID
                backup.guild.verificationLevel = server.verificationLevel

                var embed = new Discord.MessageEmbed()
                    .setTitle("<a:Gear0:898966384598474752> BACKUP in corso - 20% <a:Gear0:898966384598474752>")
                    .setDescription("Attendi un attimo, sto facendo un backup di tutto il **server** e del contenuto del **database**")
                    .setColor("#fcba03")

                msg.edit(embed)

                //CATEGORY
                var categories = await server.channels.cache.array().filter(x => x.type == "category").sort((a, b) => a.position - b.position)
                for (var categoria of categories) {
                    backup.categories.push(categoria.name)
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("<a:Gear0:898966384598474752> BACKUP in corso - 40% <a:Gear0:898966384598474752>")
                    .setDescription("Attendi un attimo, sto facendo un backup di tutto il **server** e del contenuto del **database**")
                    .setColor("#fcba03")

                msg.edit(embed)

                //CHANNELS
                var canali = await server.channels.cache.array().filter(x => x.type != "category").sort((a, b) => a.position - b.position)
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
                    }
                    if (canale.messages) {
                        await canale.messages.fetch({ limit: 50 })
                            .then(async messages => {
                                await messages.forEach(async msg => {
                                    if (!msg.system) {
                                        await info.messages.push({
                                            author: {
                                                username: msg.author.username,
                                                id: msg.author.id,
                                                avatar: msg.author.displayAvatarURL({
                                                    dynamic: true,
                                                    format: "png",
                                                    size: 1024
                                                })
                                            },
                                            content: msg.content,
                                            embed: msg.embeds,
                                            attachments: msg.attachments,
                                            components: msg.components,
                                            isPinned: msg.pinned
                                        })
                                    }
                                })
                            })
                    }

                    await backup.channels.push(info)
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("<a:Gear0:898966384598474752> BACKUP in corso - 60% <a:Gear0:898966384598474752>")
                    .setDescription("Attendi un attimo, sto facendo un backup di tutto il **server** e del contenuto del **database**")
                    .setColor("#fcba03")

                msg.edit(embed)

                //ROLES
                var ruoli = server.roles.cache.array().filter(x => x.type != "category").sort((a, b) => b.position - a.position)
                for (var ruolo of ruoli) {
                    var info = {
                        name: ruolo.name,
                        color: ruolo.color,
                        members: ruolo.members.map(m => m.user.id),
                        hoist: ruolo.hoist,
                        mentionable: ruolo.mentionable,
                        permissions: ruolo.permissions
                    }

                    await backup.roles.push(info)
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("<a:Gear0:898966384598474752> BACKUP in corso - 80% <a:Gear0:898966384598474752>")
                    .setDescription("Attendi un attimo, sto facendo un backup di tutto il **server** e del contenuto del **database**")
                    .setColor("#fcba03")

                msg.edit(embed)

                //THINGS TO DO
                var messages = await client.channels.cache.get(log.thingsToDo).messages.fetch()
                messages = messages.array()

                for (var thing of messages) {
                    var ttd = {
                        content: thing.embeds[0].fields[1].value,
                        status: thing.embeds[0].fields[0].value == "```⚪Uncompleted```" ? 0 : thing.embeds[0].fields[0].value == "```🔴Urgent```" ? 1 : thing.embeds[0].fields[0].value == "```🟢Completed```" ? 2 : thing.embeds[0].fields[0].value == "```🔵Tested```" ? 3 : thing.embeds[0].fields[0].value == "```⚫Finished```" ? 4 : ""
                    }

                    backup.thingsToDo.push(ttd)
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("<a:Gear0:898966384598474752> BACKUP in corso - 100% <a:Gear0:898966384598474752>")
                    .setDescription("Attendi un attimo, sto facendo un backup di tutto il **server** e del contenuto del **database**")
                    .setColor("#fcba03")

                msg.edit(embed)

                var attachment1 = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(userstatsList, null, "\t")), `userstats-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.json`);
                var attachment2 = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(serverstats, null, "\t")), `serverstats${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.json`);
                var attachment3 = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(backup, null, "\t")), `backup${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.json`);

                var embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: New backup :inbox_tray:")
                    .setColor("#757575")
                    .addField("Time", "```" + moment().format("dddd DD MMMM, HH:mm:ss") + "```")

                var canale = client.channels.cache.get(log.backup);
                canale.send({ embed, files: [attachment1, attachment2, attachment3] })
                    .then(msg2 => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":inbox_tray: Backup CREATO :inbox_tray:")
                            .setDescription(`Salvataggio di tutto il **server** e del contenuto dei **database** creato con successo
[Vedi backup](https://discord.com/channels/${log.server}/${log.backup}/${msg2.id})`)
                            .setColor("#18b83b")
                            .addField("Time", "```" + moment().format("dddd DD MMMM, HH:mm:ss") + "```")

                        msg.edit(embed)
                    })
            })
    },
};
