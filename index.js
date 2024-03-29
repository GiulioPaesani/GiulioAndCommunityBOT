const Discord = require("discord.js");
const fs = require("fs")
const moment = require("moment")
const googleTTS = require('google-tts-api');
const { registerFont } = require('canvas');
const settings = require("./config/general/settings.json")
const colors = require("./config/general/colors.json")
const log = require("./config/general/log.json")
const { addUser } = require("./functions/database/addUser")
const { getUser } = require("./functions/database/getUser")
const { getServer } = require("./functions/database/getServer")
const { codeError } = require('./functions/general/codeError');
const { replyMessage } = require('./functions/general/replyMessage');
const { joinVoiceChannel } = require("@discordjs/voice");
const { isMaintenance } = require('./functions/general/isMaintenance');
const { getUserPermissionLevel } = require('./functions/general/getUserPermissionLevel');
const { addQueue } = require("./functions/general/ttsQueue")
const { hasSufficientLevels } = require('./functions/leveling/hasSufficientLevels');
const { blockedChannels } = require("./functions/general/blockedChannels");
const { getAllUsers } = require("./functions/database/getAllUsers");
const { updateUser } = require("./functions/database/updateUser");
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

let cooldownCommands = []
const subtractCommandCooldown = () => {
    for (let index in cooldownCommands) {
        cooldownCommands[index].cooldown = cooldownCommands[index].cooldown - 1
    }

    cooldownCommands = cooldownCommands.filter(x => x.cooldown > 0)
}

module.exports = { subtractCommandCooldown }

//Commands Handler
client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`);
    for (const file of commandsFiles) {
        if (file.endsWith(".js")) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
        else {
            const commandsFiles2 = fs.readdirSync(`./commands/${folder}/${file}`)
            for (const file2 of commandsFiles2) {
                const command = require(`./commands/${folder}/${file}/${file2}`);
                client.commands.set(command.name, command);
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
            client.autocomplete.set(i, autocomplete);
            i++
        }
        else {
            const autocompleteFiles2 = fs.readdirSync(`./autocomplete/${folder}/${file}`)
            for (const file2 of autocompleteFiles2) {
                const autocomplete = require(`./autocomplete/${folder}/${file}/${file2}`);
                client.autocomplete.set(i, autocomplete);
                i++
            }
        }
    }
}

//Events Handler
const eventsFolders = fs.readdirSync('./events')
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`)
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                client.on(event.name, (...args) => event.execute(client, ...args));
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
    console.log('ciao', interaction.user.username)
    if (!interaction.isCommand()) return

    const maintenanceStatus = await isMaintenance(interaction.user.id)
    if (maintenanceStatus) return

    let userstats = await getUser(interaction.user.id)
    if (!userstats) userstats = await addUser(interaction.member)

    const comando = client.commands.get(interaction.commandName)
    if (!comando) return

    if (comando.permissionLevel > getUserPermissionLevel(client, interaction.user.id)) {
        return replyMessage(client, interaction, "NonPermesso", "", "", comando)
    }

    if (comando.otherGuild && interaction.guild.id != settings.idServer && getUserPermissionLevel(client, interaction.user.id) <= 2) {
        return replyMessage(client, interaction, "NonPermesso", "", "I comandi in questo server sono accessibili sono dagli utenti Owner", comando)
    }

    if (blockedChannels.includes(interaction.channelId) && getUserPermissionLevel(client, interaction.user.id) <= 2) {
        return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
    }

    let serverstats = await getServer()
    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(interaction.channelId) && !comando.channelsGranted.includes(client.channels.cache.get(interaction.channelId).parentId)) {
        if (getUserPermissionLevel(client, interaction.user.id)) {

        }
        else if (interaction.member.roles.cache.has(settings.idRuoloMonthMember)) {

        }
        else if (client.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaAdmin) {

        }
        else if (serverstats.privateRooms.find(x => x.owners.includes(interaction.user.id))?.channel == interaction.channelId) {

        }
        else if (serverstats.tickets.find(x => x.owner == interaction.user.id)?.channel == interaction.channelId) {

        }
        else {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }
    }

    let cooldown = cooldownCommands.find(x => x.user == interaction.user.id && x.command == comando.name)
    if (cooldown && cooldown.cooldown > 0 && !getUserPermissionLevel(client, interaction.user.id)) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Sei in cooldown")
            .setColor(colors.orange)
            .setDescription(`Puoi utilizzare il comando \`/${comando.name}\` tra **${cooldown.cooldown} secondi**`)

        interaction.reply({ embeds: [embed], ephemeral: true })
        return
    }
    else {
        if (comando.cooldown) {
            cooldownCommands.push({ user: interaction.user.id, command: comando.name, cooldown: comando.cooldown })
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

        const maintenanceStatus = await isMaintenance()
        if (!maintenanceStatus) {
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

            const maintenanceStatus = await isMaintenance()
            if (!maintenanceStatus) {
                client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
            }
            return
        }
    }

    if (comando.requiredLevel > 0 && getUserPermissionLevel(client, interaction.user.id) <= 1 && !hasSufficientLevels(client, userstats, comando.requiredLevel)) {
        return replyMessage(client, interaction, "InsufficientLevel", "", "", comando);
    }

    let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
    interaction.options._hoistedOptions.forEach(option => {
        testoCommand += ` ${option.name}: \`${option.value}\``
    })

    let result = await comando.execute(client, interaction, comando)
    if (!result) {
        let embed = new Discord.MessageEmbed()
            .setTitle(":bookmark: Command executed :bookmark:")
            .setColor(colors.blue)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":anchor: Channel", `#${client.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)
            .addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)

        const maintenanceStatus = await isMaintenance()
        if (!maintenanceStatus)
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

client.on("messageCreate", async message => {
    if (message.author.bot) return

    const maintenanceStates = await isMaintenance(message.author.id)
    if (maintenanceStates) return

    if (message.channel.id != settings.idCanaliServer.noMicChat) return

    if (!message.content.startsWith("'")) return

    let userstats = await getUser(message.author.id)
    if (!userstats) userstats = await addUser(message.member)

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

    let serverstats = await getServer()

    const url = googleTTS.getAudioUrl(text, {
        lang: serverstats.ttsDefaultLanguage,
        slow: false,
        host: 'https://translate.google.com',
    });

    addQueue(client, url, connection)
})