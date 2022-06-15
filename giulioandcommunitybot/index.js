const Discord = require("discord.js");
const fs = require("fs")
const moment = require("moment")
const fetch = require("node-fetch")
const express = require("express")
const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const googleTTS = require('google-tts-api');
const settings = require("./config/general/settings.json")
const colors = require("./config/general/colors.json")
const log = require("./config/general/log.json")
const illustrations = require("./config/general/illustrations.json")
const { codeError } = require('./functions/general/codeError');
const { replyMessage } = require('./functions/general/replyMessage');
const { isMaintenance } = require('./functions/general/isMaintenance');
const { getUserPermissionLevel } = require('./functions/general/getUserPermissionLevel');
const { getUser } = require('./functions/database/getUser');
const { addUser } = require('./functions/database/addUser');
const { registerFont } = require('canvas');
const { checkBadwords } = require('./functions/moderation/checkBadwords');
const { getServer } = require('./functions/database/getServer');
let { ttsQueue, ttsPlay, resetQueue, addQueue } = require('./functions/music/tts/ttsQueue');
const { joinVoiceChannel } = require("@discordjs/voice");
const { blockedChannels } = require("./functions/general/blockedChannels");
const { hasSufficientLevels } = require("./functions/leveling/hasSufficientLevels");
registerFont("./assets/font/roboto.ttf", { family: "roboto" })
registerFont("./assets/font/robotoBold.ttf", { family: "robotoBold" })

require('events').EventEmitter.prototype._maxListeners = 100;

const client = new Discord.Client({
    intents: 32767,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

try {
    require("dotenv").config()
} catch {

}

client.login(process.env.token)

client.app = express();
client.app.use(express.json());

//Commands Handler
client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/${folder}/${file}`);
            switch (command.client) {
                case "general": {
                    client.commands.set(command.name, command);
                } break;
            }
        }
        else {
            const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`)
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/${folder}/${file}/${file2}`);
                switch (command.client) {
                    case "general": {
                        client.commands.set(command.name, command);
                    } break;
                }
            }
        }
    }
}

//Autocomplete Handler
let i = 0
client.autocomplete = new Discord.Collection();
const autocompleteFolder = fs.readdirSync("./autocomplete");
for (const folder of autocompleteFolder) {
    const autocompleteFiles = fs.readdirSync(`./autocomplete/${folder}`);
    for (const file of autocompleteFiles) {
        if (file.endsWith(".js")) {
            const autocomplete = require(`./autocomplete/${folder}/${file}`);
            switch (autocomplete.client) {
                case "general": {
                    client.autocomplete.set(i, autocomplete);
                } break;
            }
            i++
        }
        else {
            const autocompleteFiles2 = fs.readdirSync(`./autocomplete/${folder}/${file}`)
            for (const file2 of autocompleteFiles2) {
                const autocomplete = require(`./autocomplete/${folder}/${file}/${file2}`);
                switch (autocomplete.client) {
                    case "general": {
                        client.autocomplete.set(i, autocomplete);
                    } break;
                }
                i++
            }
        }
    }
}

//Events Handler
client.events = 0;
const eventsFolders = fs.readdirSync('./events').filter(x => x != "music");
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`)
            switch (event.client) {
                case "general": {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                    client.events++
                } break;
            }
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                switch (event.client) {
                    case "general": {
                        client.on(event.name, (...args) => event.execute(client, ...args));
                        client.events++
                    } break;
                }
            }
        }
    }
}

//Codes handler
client.codes = new Discord.Collection();
const codesFolder = fs.readdirSync("./code");
for (const file of codesFolder) {
    const code = require(`./code/${file}`);
    client.codes.set(code.id, code);
}

process.on("uncaughtException", err => {
    codeError(client, err);
})
process.on("unhandledRejection", err => {
    codeError(client, err);
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return

    if (isMaintenance(interaction.user.id)) return

    let userstats = getUser(interaction.user.id)
    if (!userstats) userstats = addUser(interaction.member)[0]

    const comando = client.commands.get(interaction.commandName)
    if (!comando) return

    if (comando.client != "general") return

    if (comando.permissionLevel > getUserPermissionLevel(client, interaction.user.id)) {
        return replyMessage(client, interaction, "NonPermesso", "", "", comando)
    }

    if (comando.otherGuild && interaction.guild.id != settings.idServer && getUserPermissionLevel(client, interaction.user.id) <= 2) {
        return replyMessage(client, interaction, "NonPermesso", "", "I comandi in questo server sono accessibili sono dagli utenti Owner", comando)
    }

    if (blockedChannels.includes(interaction.channelId) && getUserPermissionLevel(client, interaction.user.id) <= 2) {
        if (comando.name == "poll" && interaction.user.id == settings.idCanaliServer.staffPolls) {

        }
        else {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }
    }

    let serverstats = getServer()
    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(interaction.channelId) && !comando.channelsGranted.includes(client.channels.cache.get(interaction.channelId).parentId)) {
        if (getUserPermissionLevel(client, interaction.user.id) >= 2) {

        }
        else if (client.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaAdmin) {

        }
        else if (getUserPermissionLevel(client, interaction.user.id) >= 1 && (comando.category == "moderation" || comando.name == "video" || comando.name == "code")) {

        }
        else if (serverstats.privateRooms.find(x => x.owners.includes(interaction.user.id))?.channel == interaction.channelId) {

        }
        else if (serverstats.tickets.find(x => x.owner == interaction.user.id)?.channel == interaction.channelId && (getUserPermissionLevel(client, interaction.user.id) >= 1 || serverstats.tickets.find(x => x.owner == interaction.user.id))) {

        }
        else {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }
    }

    if (interaction.channelId == settings.idCanaliServer.onewordstory && (!getUserPermissionLevel(client, interaction.user.id) || comando.name == "say")) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Canale non concesso")
            .setColor(colors.yellow)
            .setDescription(`In questo canale non è possibile eseguire nessun comando`)

        interaction.reply({ embeds: [embed], ephemeral: true })

        let embed2 = new Discord.MessageEmbed()
            .setTitle(":construction: Channel not granted :construction:")
            .setColor(colors.yellow)
            .setThumbnail(interaction.guild.members.cache.get(interaction.user.id).displayAvatarURL({ dynamic: true }) || interaction.user.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":anchor: Channel", `#${client.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)

        if (comando) {
            let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
            interaction.options?._hoistedOptions?.forEach(option => {
                testoCommand += ` ${option.name}: \`${option.value}\``
            })
            embed2.addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)
        }

        if (!isMaintenance()) {
            client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
        }

        return
    }

    if (serverstats.privateRooms.find(x => !x.owners.includes(interaction.user.id))?.channel == interaction.channelId && !getUserPermissionLevel(client, interaction.user.id)) {
        if (!serverstats.privateRooms.find(x => !x.owners.includes(interaction.user.id)).mode.messages) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Messaggi bloccati")
                .setColor(colors.yellow)
                .setDescription("In questa stanza privata non sono concessi i messaggi, quindi non puoi eseguire comandi qui")

            interaction.reply({ embeds: [embed], ephemeral: true })

            let embed2 = new Discord.MessageEmbed()
                .setTitle(":construction: No messages in Private Rooms :construction:")
                .setColor(colors.yellow)
                .setThumbnail(interaction.guild.members.cache.get(interaction.user.id).displayAvatarURL({ dynamic: true }) || interaction.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":anchor: Channel", `#${client.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)

            let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
            interaction.options?._hoistedOptions?.forEach(option => {
                testoCommand += ` ${option.name}: \`${option.value}\``
            })
            embed2.addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)

            if (!isMaintenance()) {
                client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
            }
            return
        }
    }

    if (getUserPermissionLevel(client, interaction.user.id) <= 1 && !hasSufficientLevels(client, userstats, comando.requiredLevel)) {
        return replyMessage(client, interaction, "InsufficientLevel", "", "", comando)
    }

    let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
    interaction.options._hoistedOptions.forEach(option => {
        testoCommand += ` ${option.name}: \`${option.value}\``
    })

    let [trovata, nonCensurato, censurato] = checkBadwords(testoCommand);

    if (trovata && !getUserPermissionLevel(client, interaction.user.id) && !interaction.member.roles.cache.has(settings.idRuoloFeatureActivator)) {
        interaction.reply({ content: "Comando non valido" })
        interaction.deleteReply()

        await fetch("http://localhost:3000/badwords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            },
            body: JSON.stringify({
                userId: interaction.user.id,
                channelId: interaction.channelId,
                censurato,
                nonCensurato
            })
        })
        return
    }

    let musicClient, distube
    if (comando.musicMode) {
        return replyMessage(client, interaction, "Warning", "Musica non disponibile", "I comandi di musica sono temporaneamente non disponibili, tra qualche giorno saranno di nuovo utilizzabili", comando)

        const voiceChannel = interaction.member.voice.channel
        if (!voiceChannel) {
            return replyMessage(client, interaction, "Warning", "Non sei in un canale vocale", "Per eseguire questo comando devi essere connesso a un canale vocale", comando)
        }

        musicBots.forEach(bot => {
            if (interaction.guild.channels.cache.find(x => x.id == voiceChannel.id && x.members.has(bot.client.user.id))) {
                musicClient = bot.client
                distube = bot.distube
            }
        })

        if (!musicClient) {
            settings.botMusicali.forEach(bot => {
                if (!interaction.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members?.has(bot.id)) && !musicClient) {
                    musicClient = musicBots.find(x => x.client.user.id == bot.id).client
                    distube = musicBots.find(x => x.client.user.id == bot.id).distube
                }
            })

            if (!musicClient) {
                return replyMessage(client, interaction, "Warning", "Nessun bot disponibile", "Tutti i bot musicali sono occupati e utilizzati da altri utenti", comando)
            }
        }
    }

    if (musicClient)
        interaction.applicationId = musicClient.user.id

    let result = await comando.execute(client, interaction, comando, distube, musicClient)
    if (!result) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":bookmark: Command executed :bookmark:")
            .setColor(colors.blue)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":anchor: Channel", `#${client.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)
            .addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)

        if (!isMaintenance())
            client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })
    }
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isAutocomplete()) return

    const autocomplete = client.autocomplete.find(x => x.commandName == interaction.commandName && x.optionName == interaction.options.getFocused(true).name)
    if (!autocomplete) return

    let response = await autocomplete.getResponse(client, interaction.options.getFocused(true), interaction)
    if (!response) return

    interaction.respond(response.slice(0, 25))
})

client.on("messageCreate", message => {
    if (message.author.bot) return

    if (isMaintenance(message.author.id)) return

    if (message.channel.id != settings.idCanaliServer.noMicChat) return

    if (!message.content.startsWith("'")) return

    let userstats = getUser(message.author.id)
    if (!userstats) userstats = addUser(message.member)[0]

    if (!hasSufficientLevels(client, userstats, 15)) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Livello insufficiente")
            .setColor(colors.pink)
            .setDescription(`Per utilizzare il comando \`'[testo]\` è necessario almeno il ${message.guild.roles.cache.find(x => x.name == "Level 15").toString()} o **boostare** il server`)

        return message.channel.send({ embeds: [embed] })
    }

    let text = message.content.slice(1).trim()
    if (!text) return

    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Non sei in un canale vocale")
            .setColor(colors.gray)
            .setDescription("Per eseguire questo comando devi essere connesso a un canale vocale")

        return message.channel.send({ embeds: [embed] })
    }

    const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
    if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Bot occupato")
            .setColor(colors.gray)
            .setDescription("Il bot è già occupato in un'altra stanza e non puoi utilizzarlo al momento")

        return message.channel.send({ embeds: [embed] })
    }

    if (text.length > 200) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Testo troppo lungo")
            .setColor(colors.gray)
            .setDescription("Puoi scrivere un testo solo fino a 200 caratteri")

        return message.channel.send({ embeds: [embed] })
    }

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })

    let serverstats = getServer()

    const url = googleTTS.getAudioUrl(text, {
        lang: serverstats.ttsDefaultLanguage,
        slow: false,
        host: 'https://translate.google.com',
    });

    addQueue(client, url, connection)
})

client.app.get("/client", (req, res) => {
    const { authorization } = req.headers

    if (authorization != process.env.apiKey) return res.sendStatus(401)

    res.send({
        user: client.user,
        ping: client.ws.ping,
        uptime: client.uptime,
        avatar: client.user.avatarURL({ size: 1024 }),
        createdAt: client.user.createdAt,
        commands: client.commands,
        token: client.token,
    })
})

client.app.get("/reload/:command", async (req, res) => {
    const { authorization } = req.headers

    if (authorization != process.env.apiKey) return res.sendStatus(401)

    let { command } = req.params

    if (!client.commands.has(command)) return res.sendStatus(404)

    command = client.commands.get(command)

    let server = client.guilds.cache.get(settings.idServer)

    await server.commands.fetch()
        .then(async commands => {
            commands.forEach(async command2 => {
                if (command2.name == command.name) {
                    await command2.delete()
                }
            })
        })

    let data = command.data || {}
    data.name = command.name
    data.description = command.description

    await server.commands.create(data)

    res.sendStatus(200)
})