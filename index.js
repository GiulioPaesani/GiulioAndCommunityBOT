const Discord = require("discord.js");
const fs = require("fs")
const moment = require("moment")
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
const { checkBadwords } = require('./functions/moderaction/checkBadwords');
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

const clientModeration = new Discord.Client({
    intents: 32767,
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
})
const clientFun = new Discord.Client({
    intents: 32767,
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
})
const clientRanking = new Discord.Client({
    intents: 32767,
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
})

try {
    require("dotenv").config()
} catch {

}

client.login(process.env.token)
clientModeration.login(process.env.tokenModeration)
clientFun.login(process.env.tokenFun)
clientRanking.login(process.env.tokenRanking)

let musicBots = []
let countMusicBots = 3

for (let i = 1; i <= countMusicBots; i++) {
    const clientMusic = new Discord.Client({
        intents: 32767,
        allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
    })
    let bot = {
        client: clientMusic,
        distube: new DisTube(clientMusic, {
            youtubeDL: false,
            plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
            leaveOnEmpty: true,
            leaveOnStop: true,
            emptyCooldown: 20,
        })
    }

    clientMusic.login(process.env["tokenMusic" + i])

    clientMusic.on("ready", () => {
        clientMusic.user.setActivity('/play', { type: 'LISTENING' });

        console.log(`-- ${clientMusic.user.username} è ONLINE! --`)

        let utente = client.guilds.cache.get(settings.idServer)?.members.cache.get(clientMusic.user.id)
        utente?.voice?.disconnect()
    })

    musicBots.push(bot)
}

module.exports = { musicBots, client, clientModeration, clientFun, clientRanking }

//Commands Handler
client.commands = new Discord.Collection();
clientModeration.commands = new Discord.Collection();
clientFun.commands = new Discord.Collection();
clientRanking.commands = new Discord.Collection();
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
                case "moderation": {
                    clientModeration.commands.set(command.name, command);
                } break;
                case "fun": {
                    clientFun.commands.set(command.name, command);
                } break;
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
                    case "general": {
                        client.commands.set(command.name, command);
                    } break;
                    case "moderation": {
                        clientModeration.commands.set(command.name, command);
                    } break;
                    case "fun": {
                        clientFun.commands.set(command.name, command);
                    } break;
                    case "ranking": {
                        clientRanking.commands.set(command.name, command);
                    } break;
                }
            }
        }
    }
}

//Autocomplete Handler
let i = 0
client.autocomplete = new Discord.Collection();
clientModeration.autocomplete = new Discord.Collection();
clientFun.autocomplete = new Discord.Collection();
clientRanking.autocomplete = new Discord.Collection();
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
                case "moderation": {
                    clientModeration.autocomplete.set(i, autocomplete);
                } break;
                case "fun": {
                    clientFun.autocomplete.set(i, autocomplete);
                } break;
                case "ranking": {
                    clientRanking.autocomplete.set(i, autocomplete);
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
                    case "moderation": {
                        clientModeration.autocomplete.set(i, autocomplete);
                    } break;
                    case "fun": {
                        clientFun.autocomplete.set(i, autocomplete);
                    } break;
                    case "ranking": {
                        clientRanking.autocomplete.set(i, autocomplete);
                    } break;
                }
                i++
            }
        }
    }
}

//Events Handler
client.events = 0;
clientModeration.events = 0;
clientFun.events = 0;
clientRanking.events = 0;
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
                case "moderation": {
                    clientModeration.on(event.name, (...args) => event.execute(clientModeration, ...args));
                    clientModeration.events++
                } break;
                case "fun": {
                    clientFun.on(event.name, (...args) => event.execute(clientFun, ...args));
                    clientFun.events++
                } break;
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
                    case "general": {
                        client.on(event.name, (...args) => event.execute(client, ...args));
                        client.events++
                    } break;
                    case "moderation": {
                        clientModeration.on(event.name, (...args) => event.execute(clientModeration, ...args));
                        clientModeration.events++
                    } break;
                    case "fun": {
                        clientFun.on(event.name, (...args) => event.execute(clientFun, ...args));
                        clientFun.events++
                    } break;
                    case "ranking": {
                        clientRanking.on(event.name, (...args) => event.execute(clientRanking, ...args));
                        clientRanking.events++
                    } break;
                }
            }
        }
    }
}

//Music events handler
const eventsFiles = fs.readdirSync(`./events/music`)
for (const file of eventsFiles) {
    if (file.endsWith(".js")) {
        const event = require(`./events/music/${file}`)
        musicBots.forEach(bot => {
            bot.distube.on(event.name, (...args) => event.execute(bot.client, bot.distube, ...args));
            bot.client.events = (bot.client.events || 0) + 1
        })
    }
    else {
        const eventsFiles2 = fs.readdirSync(`./events/music/${file}`)
        for (const file2 of eventsFiles2) {
            const event = require(`./events/music/${file}/${file2}`);
            musicBots.forEach(bot => {
                bot.distube.on(event.name, (...args) => event.execute(bot.client, bot.distube, ...args));
                bot.client.events = (bot.client.events || 0) + 1
            })
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
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[BAD WORDS] ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription("L'utilizzo di certe parole in questo server non è consentito")
            .setThumbnail(illustrations.badWords)
            .setColor(colors.purple)
            .addField(":envelope: Message command", censurato.slice(0, 1024))
            .setFooter({ text: "User ID: " + interaction.user.id })

        interaction.reply({ content: "Comando non valido" })
        interaction.deleteReply()

        clientModeration.channels.cache.get(interaction.channelId).send({ embeds: [embed] })
            .then(msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                    .addField(":anchor: Channel", `${clientModeration.channels.cache.get(interaction.channelId).toString()} - #${clientModeration.channels.cache.get(interaction.channelId).name}\nID: ${interaction.channelId}`)
                    .addField(":envelope: Message command", nonCensurato.slice(0, 1024))

                if (!isMaintenance())
                    clientModeration.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor(colors.purple)
            .setThumbnail(illustrations.badWords)
            .addField(":envelope: Message", censurato.slice(0, 1024))
            .addField(":anchor: Channel", client.channels.cache.get(interaction.channelId).toString())

        clientModeration.users.cache.get(interaction.user.id).send({ embeds: [embed] })
            .catch(() => { })
        return
    }

    let musicClient, distube
    if (comando.musicMode) {
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
clientModeration.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return

    if (isMaintenance(interaction.user.id)) return

    let userstats = getUser(interaction.user.id)
    if (!userstats) userstats = addUser(interaction.member)[0]

    const comando = clientModeration.commands.get(interaction.commandName)
    if (!comando) return

    if (comando.client != "moderation") return

    if (comando.permissionLevel > getUserPermissionLevel(clientModeration, interaction.user.id)) {
        return replyMessage(clientModeration, interaction, "NonPermesso", "", "", comando)
    }

    if (comando.otherGuild && interaction.guild.id != settings.idServer && getUserPermissionLevel(clientModeration, interaction.user.id) <= 2) {
        return replyMessage(clientModeration, interaction, "NonPermesso", "", "I comandi in questo server sono accessibili sono dagli utenti Owner", comando)
    }

    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(interaction.channelId) && !comando.channelsGranted.includes(clientModeration.channels.cache.get(interaction.channelId).parentId)) {
        let serverstats = getServer()
        if (getUserPermissionLevel(clientModeration, interaction.user.id) >= 2) {

        }
        else if (client.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaAdmin) {

        }
        else if (getUserPermissionLevel(clientModeration, interaction.user.id) >= 1 && (comando.category == "moderation" || comando.name == "video" || comando.name == "code")) {

        }
        else if (serverstats.privateRooms.find(x => x.owners.includes(interaction.user.id))?.channel == interaction.channelId) {

        }
        else if (serverstats.tickets.find(x => x.owner == interaction.user.id)?.channel == interaction.channelId && (getUserPermissionLevel(clientModeration, interaction.user.id) >= 1 || serverstats.tickets.find(x => x.owner == interaction.user.id))) {

        }
        else {
            return replyMessage(clientModeration, interaction, "CanaleNonConcesso", "", "", comando)
        }
    }

    if (interaction.channelId == settings.idCanaliServer.onewordstory && (!getUserPermissionLevel(clientModeration, interaction.user.id) || comando.name == "say")) {
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
            .addField(":anchor: Channel", `#${clientModeration.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)

        if (comando) {
            let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
            interaction.options?._hoistedOptions?.forEach(option => {
                testoCommand += ` ${option.name}: \`${option.value}\``
            })
            embed2.addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)
        }

        if (!isMaintenance()) {
            clientModeration.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
        }

        return
    }

    if (getUserPermissionLevel(clientModeration, interaction.user.id) <= 1 && !hasSufficientLevels(clientModeration, userstats, comando.requiredLevel)) {
        return replyMessage(clientModeration, interaction, "InsufficientLevel", "", "", comando)
    }

    let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
    interaction.options._hoistedOptions.forEach(option => {
        testoCommand += ` ${option.name}: \`${option.value}\``
    })

    let [trovata, nonCensurato, censurato] = checkBadwords(testoCommand);

    if (trovata && !getUserPermissionLevel(clientModeration, interaction.user.id) && !interaction.member.roles.cache.has(settings.idRuoloFeatureActivator)) {
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[BAD WORDS] ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription("L'utilizzo di certe parole in questo server non è consentito")
            .setThumbnail(illustrations.badWords)
            .setColor(colors.purple)
            .addField(":envelope: Message command", censurato.slice(0, 1024))
            .setFooter({ text: "User ID: " + interaction.user.id })

        interaction.reply({ content: "Comando non valido" })
        interaction.deleteReply()

        clientModeration.channels.cache.get(interaction.channelId).send({ embeds: [embed] })
            .then(msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                    .addField(":anchor: Channel", `${clientModeration.channels.cache.get(interaction.channelId).toString()} - #${clientModeration.channels.cache.get(interaction.channelId).name}\nID: ${interaction.channelId}`)
                    .addField(":envelope: Message command", nonCensurato.slice(0, 1024))

                if (!isMaintenance())
                    clientModeration.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor(colors.purple)
            .setThumbnail(illustrations.badWords)
            .addField(":envelope: Message", censurato.slice(0, 1024))
            .addField(":anchor: Channel", clientModeration.channels.cache.get(interaction.channelId).toString())

        clientModeration.users.cache.get(interaction.user.id).send({ embeds: [embed] })
            .catch(() => { })
        return
    }

    let result = await comando.execute(clientModeration, interaction, comando)
    if (!result) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":bookmark: Command executed :bookmark:")
            .setColor(colors.blue)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":anchor: Channel", `#${clientModeration.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)
            .addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)

        if (!isMaintenance())
            clientModeration.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })
    }
})
clientFun.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return

    if (isMaintenance(interaction.user.id)) return

    let userstats = getUser(interaction.user.id)
    if (!userstats) userstats = addUser(interaction.member)[0]

    const comando = clientFun.commands.get(interaction.commandName)
    if (!comando) return

    if (comando.client != "fun") return

    if (comando.permissionLevel > getUserPermissionLevel(clientFun, interaction.user.id)) {
        return replyMessage(clientFun, interaction, "NonPermesso", "", "", comando)
    }

    if (comando.otherGuild && interaction.guild.id != settings.idServer && getUserPermissionLevel(clientFun, interaction.user.id) <= 2) {
        return replyMessage(clientFun, interaction, "NonPermesso", "", "I comandi in questo server sono accessibili sono dagli utenti Owner", comando)
    }

    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(interaction.channelId) && !comando.channelsGranted.includes(clientFun.channels.cache.get(interaction.channelId).parentId)) {
        let serverstats = getServer()
        if (getUserPermissionLevel(clientFun, interaction.user.id) >= 2) {

        }
        else if (client.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaAdmin) {

        }
        else if (getUserPermissionLevel(clientFun, interaction.user.id) >= 1 && (comando.category == "moderation" || comando.name == "video" || comando.name == "code")) {

        }
        else if (serverstats.privateRooms.find(x => x.owners.includes(interaction.user.id))?.channel == interaction.channelId) {

        }
        else if (serverstats.tickets.find(x => x.owner == interaction.user.id)?.channel == interaction.channelId && (getUserPermissionLevel(clientFun, interaction.user.id) >= 1 || serverstats.tickets.find(x => x.owner == interaction.user.id))) {

        }
        else {
            return replyMessage(clientFun, interaction, "CanaleNonConcesso", "", "", comando)
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
            .addField(":anchor: Channel", `#${clientFun.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)

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

    if (getUserPermissionLevel(clientFun, interaction.user.id) <= 1 && !hasSufficientLevels(clientFun, userstats, comando.requiredLevel)) {
        return replyMessage(clientFun, interaction, "InsufficientLevel", "", "", comando)
    }

    let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
    interaction.options._hoistedOptions.forEach(option => {
        testoCommand += ` ${option.name}: \`${option.value}\``
    })

    let [trovata, nonCensurato, censurato] = checkBadwords(testoCommand);

    if (trovata && !getUserPermissionLevel(clientModeration, interaction.user.id) && !interaction.member.roles.cache.has(settings.idRuoloFeatureActivator)) {
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[BAD WORDS] ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription("L'utilizzo di certe parole in questo server non è consentito")
            .setThumbnail(illustrations.badWords)
            .setColor(colors.purple)
            .addField(":envelope: Message command", censurato.slice(0, 1024))
            .setFooter({ text: "User ID: " + interaction.user.id })

        interaction.reply({ content: "Comando non valido" })
        interaction.deleteReply()

        clientModeration.channels.cache.get(interaction.channelId).send({ embeds: [embed] })
            .then(msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                    .addField(":anchor: Channel", `${clientModeration.channels.cache.get(interaction.channelId).toString()} - #${clientModeration.channels.cache.get(interaction.channelId).name}\nID: ${interaction.channelId}`)
                    .addField(":envelope: Message command", nonCensurato.slice(0, 1024))

                if (!isMaintenance())
                    clientModeration.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor(colors.purple)
            .setThumbnail(illustrations.badWords)
            .addField(":envelope: Message", censurato.slice(0, 1024))
            .addField(":anchor: Channel", clientModeration.channels.cache.get(interaction.channelId).toString())

        clientModeration.users.cache.get(interaction.user.id).send({ embeds: [embed] })
            .catch(() => { })
        return
    }

    let result = await comando.execute(clientFun, interaction, comando)
    if (!result) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":bookmark: Command executed :bookmark:")
            .setColor(colors.blue)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":anchor: Channel", `#${clientFun.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)
            .addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)

        if (!isMaintenance())
            clientFun.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })
    }
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

    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(interaction.channelId) && !comando.channelsGranted.includes(clientRanking.channels.cache.get(interaction.channelId).parentId)) {
        let serverstats = getServer()
        if (getUserPermissionLevel(clientRanking, interaction.user.id) >= 2) {

        }
        else if (client.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaAdmin) {

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

    if (trovata && !getUserPermissionLevel(clientModeration, interaction.user.id) && !interaction.member.roles.cache.has(settings.idRuoloFeatureActivator)) {
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[BAD WORDS] ${interaction.member.nickname || interaction.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setDescription("L'utilizzo di certe parole in questo server non è consentito")
            .setThumbnail(illustrations.badWords)
            .setColor(colors.purple)
            .addField(":envelope: Message command", censurato.slice(0, 1024))
            .setFooter({ text: "User ID: " + interaction.user.id })

        interaction.reply({ content: "Comando non valido" })
        interaction.deleteReply()

        clientModeration.channels.cache.get(interaction.channelId).send({ embeds: [embed] })
            .then(msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                    .addField(":anchor: Channel", `${clientModeration.channels.cache.get(interaction.channelId).toString()} - #${clientModeration.channels.cache.get(interaction.channelId).name}\nID: ${interaction.channelId}`)
                    .addField(":envelope: Message command", nonCensurato.slice(0, 1024))

                if (!isMaintenance())
                    clientModeration.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor(colors.purple)
            .setThumbnail(illustrations.badWords)
            .addField(":envelope: Message", censurato.slice(0, 1024))
            .addField(":anchor: Channel", clientModeration.channels.cache.get(interaction.channelId).toString())

        clientModeration.users.cache.get(interaction.user.id).send({ embeds: [embed] })
            .catch(() => { })
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

client.on("interactionCreate", async interaction => {
    if (!interaction.isAutocomplete()) return

    const autocomplete = client.autocomplete.find(x => x.commandName == interaction.commandName && x.optionName == interaction.options.getFocused(true).name)
    if (!autocomplete) return

    let response = await autocomplete.getResponse(client, interaction.options.getFocused(true), interaction)
    if (!response) return

    interaction.respond(response.slice(0, 25))
})
clientModeration.on("interactionCreate", async interaction => {
    if (!interaction.isAutocomplete()) return

    const autocomplete = clientModeration.autocomplete.find(x => x.commandName == interaction.commandName && x.optionName == interaction.options.getFocused(true).name)
    if (!autocomplete) return

    let response = await autocomplete.getResponse(clientModeration, interaction.options.getFocused(true), interaction)
    if (!response) return

    interaction.respond(response.slice(0, 25))
})
clientFun.on("interactionCreate", async interaction => {
    if (!interaction.isAutocomplete()) return

    const autocomplete = clientFun.autocomplete.find(x => x.commandName == interaction.commandName && x.optionName == interaction.options.getFocused(true).name)
    if (!autocomplete) return

    let response = await autocomplete.getResponse(clientFun, interaction.options.getFocused(true), interaction)
    if (!response) return

    interaction.respond(response.slice(0, 25))
})
clientRanking.on("interactionCreate", async interaction => {
    if (!interaction.isAutocomplete()) return

    const autocomplete = clientRanking.autocomplete.find(x => x.commandName == interaction.commandName && x.optionName == interaction.options.getFocused(true).name)
    if (!autocomplete) return

    let response = await autocomplete.getResponse(clientRanking, interaction.options.getFocused(true), interaction)
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