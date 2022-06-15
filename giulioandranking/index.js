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
const { checkBadwords } = require('./functions/moderation/checkBadwords');
const { getServer } = require('./functions/database/getServer');
const { blockedChannels } = require("./functions/general/blockedChannels");
const { hasSufficientLevels } = require("./functions/leveling/hasSufficientLevels");

require('events').EventEmitter.prototype._maxListeners = 100;

const clientRanking = new Discord.Client({
    intents: 32767,
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
})

try {
    require("dotenv").config()
} catch {

}

clientRanking.login(process.env.tokenRanking)

clientRanking.app = express();
clientRanking.app.use(express.json());

//Commands Handler
clientRanking.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/${folder}/${file}`);
            switch (command.client) {
                case "ranking": {
                    clientRanking.commands.set(command.name, command);
                } break;
            }
        }
        else {
            const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`)
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/${folder}/${file}/${file2}`);
                switch (command.client) {
                    case "ranking": {
                        clientRanking.commands.set(command.name, command);
                    } break;
                }
            }
        }
    }
}

//Events Handler
clientRanking.events = 0;
const eventsFolders = fs.readdirSync('./events').filter(x => x != "music");
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`)
            switch (event.client) {
                case "ranking": {
                    clientRanking.on(event.name, (...args) => event.execute(clientRanking, ...args));
                    clientRanking.events++
                } break;
            }
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                switch (event.client) {
                    case "ranking": {
                        clientRanking.on(event.name, (...args) => event.execute(clientRanking, ...args));
                        clientRanking.events++
                    } break;
                }
            }
        }
    }
}

process.on("uncaughtException", err => {
    codeError(clientRanking, err);
})
process.on("unhandledRejection", err => {
    codeError(clientRanking, err);
})

clientRanking.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return

    if (isMaintenance(interaction.user.id)) return

    let userstats = getUser(interaction.user.id)
    if (!userstats) userstats = addUser(interaction.member)[0]

    const comando = clientRanking.commands.get(interaction.commandName)
    if (!comando) return

    if (comando.client != "ranking") return

    if (comando.permissionLevel > getUserPermissionLevel(clientRanking, interaction.user.id)) {
        return replyMessage(clientRanking, interaction, "NonPermesso", "", "", comando)
    }

    if (comando.otherGuild && interaction.guild.id != settings.idServer && getUserPermissionLevel(clientRanking, interaction.user.id) <= 2) {
        return replyMessage(clientRanking, interaction, "NonPermesso", "", "I comandi in questo server sono accessibili sono dagli utenti Owner", comando)
    }

    if (blockedChannels.includes(interaction.channelId) && getUserPermissionLevel(clientRanking, interaction.user.id) <= 2) {
        return replyMessage(clientRanking, interaction, "CanaleNonConcesso", "", "", comando)
    }

    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(interaction.channelId) && !comando.channelsGranted.includes(clientRanking.channels.cache.get(interaction.channelId).parentId)) {
        let serverstats = getServer()
        if (getUserPermissionLevel(clientRanking, interaction.user.id) >= 2) {

        }
        else if (clientRanking.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaAdmin) {

        }
        else if (getUserPermissionLevel(clientRanking, interaction.user.id) >= 1 && (comando.category == "moderation" || comando.name == "video" || comando.name == "code")) {

        }
        else if (serverstats.privateRooms.find(x => x.owners.includes(interaction.user.id))?.channel == interaction.channelId) {

        }
        else if (serverstats.tickets.find(x => x.owner == interaction.user.id)?.channel == interaction.channelId && (getUserPermissionLevel(clientRanking, interaction.user.id) >= 1 || serverstats.tickets.find(x => x.owner == interaction.user.id))) {

        }
        else {
            return replyMessage(clientRanking, interaction, "CanaleNonConcesso", "", "", comando)
        }
    }

    if (interaction.channelId == settings.idCanaliServer.onewordstory && (!getUserPermissionLevel(clientRanking, interaction.user.id) || comando.name == "say")) {
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
            .addField(":anchor: Channel", `#${clientRanking.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)

        if (comando) {
            let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
            interaction.options?._hoistedOptions?.forEach(option => {
                testoCommand += ` ${option.name}: \`${option.value}\``
            })
            embed2.addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)
        }

        if (!isMaintenance()) {
            clientRanking.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
        }
        return
    }

    if (getUserPermissionLevel(clientRanking, interaction.user.id) <= 1 && !hasSufficientLevels(clientRanking, userstats, comando.requiredLevel)) {
        return replyMessage(clientRanking, interaction, "InsufficientLevel", "", "", comando)
    }

    let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
    interaction.options._hoistedOptions.forEach(option => {
        testoCommand += ` ${option.name}: \`${option.value}\``
    })

    let [trovata, nonCensurato, censurato] = checkBadwords(testoCommand);

    if (trovata && !getUserPermissionLevel(clientRanking, interaction.user.id) && !interaction.member.roles.cache.has(settings.idRuoloFeatureActivator)) {
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

    let result = await comando.execute(clientRanking, interaction, comando)
    if (!result) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":bookmark: Command executed :bookmark:")
            .setColor(colors.blue)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":anchor: Channel", `#${clientRanking.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)
            .addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)

        if (!isMaintenance())
            clientRanking.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })
    }
})

clientRanking.app.get("/client", (req, res) => {
    const { authorization } = req.headers

    if (authorization != process.env.apiKey) return res.sendStatus(401)

    res.send({
        user: clientRanking.user,
        ping: clientRanking.ws.ping,
        uptime: clientRanking.uptime,
        avatar: clientRanking.user.avatarURL({ size: 1024 }),
        createdAt: clientRanking.user.createdAt,
        commands: clientRanking.commands,
        token: clientRanking.token,
    })
})

clientRanking.app.get("/reload/:command", async (req, res) => {
    const { authorization } = req.headers

    if (authorization != process.env.apiKey) return res.sendStatus(401)

    let { command } = req.params

    if (!clientRanking.commands.has(command)) return res.sendStatus(404)

    let server = clientRanking.guilds.cache.get(settings.idServer)

    command = clientRanking.commands.get(command)

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

clientRanking.app.get("/checklevelup/:userid", (req, res) => {
    const { authorization } = req.headers

    if (authorization != process.env.apiKey) return res.sendStatus(401)

    let { userid } = req.params

    let userstats = getUser(userid)

    userstats = checkLevelUp(clientRanking, userstats)

    updateUser(userstats)
})
