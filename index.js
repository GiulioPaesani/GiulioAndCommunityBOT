require('events').EventEmitter.prototype._maxListeners = 200;

global.Discord = require("discord.js");
global.client = new Discord.Client({
    intents: 32767,
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

const fs = require("fs");
global.ytch = require('yt-channel-info');
global.moment = require("moment");
global.ms = require("ms");
global.Parser = require('expr-eval').Parser;
global.MongoClient = require('mongodb').MongoClient;

global.settings = require("./config/settings.json");

try {
    require("dotenv").config()
} catch { }

client.login(process.env.token);

//COMMANDS
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
//EVENTS
const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            client.on(event.name, (...args) => event.execute(...args));
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}
//FUNCTIONS
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
    require(`./functions/${file}`);
}

global.log = require("./config/log.json");

global.database = "";
global.url = settings.db

global.serverstats = ""
global.userstatsList = ""

global.usersIndividualSpam = new Map()
global.usersGroupSpam = new Map();

global.invites = new Map();

//CODES comando !code
global.client.codes = new Discord.Collection();
const codesFolder = fs.readdirSync("./code");
for (const file of codesFolder) {
    const code = require(`./code/${file}`);
    client.codes.set(code.name, code);
}

global.prefix = "!"
client.on("messageCreate", async message => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return;
    if (!message.channel.type == "DM" && (message.guild.id != settings.idServer && message.guild.id != log.idServer)) return
    if (!userstatsList) return

    if (message.channel.id == log.general.thingsToDo) return

    if (isMaintenance(message.author.id)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase()

    if (!command[0]?.replace(/[^a-z]/g, "")) return

    trovata = getParolaccia(message.content)[0];
    if (trovata && !utenteMod(message.author)) return

    //Verifica esistenza comando
    if (!client.commands.has(command) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))) {
        if (message.author.id != settings.idGiulio) {
            var embed = new Discord.MessageEmbed()
                .setTitle(":warning: Command not found :warning:")
                .setColor("#FF931E")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
                .addField("Channel", `#${message.channel.name}`, false)
                .addField("Command", `!${command}`, false)
            if (`!${command}` != message.content)
                embed.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

            if (!isMaintenance())
                client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })

            botCommandMessage(message, "ComandoNonEsistente")
        }
        return
    }

    var comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    //Verifica permesso
    if (comando.onlyStaff && !utenteMod(message.author)) {
        botCommandMessage(message, "NonPermesso")
        return
    }

    if (message.channel.type == "DM") {
        if (!comando.availableOnDM) {
            var embed = new Discord.MessageEmbed()
                .setTitle(":construction: DM not granted :construction:")
                .setColor("#e3b009")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
                .addField("Command", `!${command}`, false)
            if (`!${command}` != message.content)
                embed.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

            if (!isMaintenance())
                client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })

            botCommandMessage(message, "DMNonAbilitati", "", "", comando)
            return
        }
    }
    //Verifica canale concesso
    else if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(message.channel.id) && !utenteMod(message.author)) {
        if ((comando.name == "code" && (message.member.roles.cache.has(settings.idRuoloAiutante) || message.member.roles.cache.has(settings.idRuoloAiutanteInProva))) || (serverstats.privateRooms.find(x => x.owner == message.author.id) && serverstats.privateRooms.find(x => x.owner == message.author.id).text && serverstats.privateRooms.find(x => x.owner == message.author.id).text == message.channel.id) || (serverstats.ticket.find(x => x.owner == message.author.id) && serverstats.ticket.find(x => x.owner == message.author.id).channel == message.channel.id)) {

        } else {
            botCommandMessage(message, "CanaleNonConcesso", "", "", comando)
            return
        }
    }

    //Poter utilizzare solo !clear in #tutorial
    if (message.channel == settings.idCanaliServer.tutorial && comando.name != "clear") return

    var result = await comando.execute(message, args, client, comando)
    if (!result) {
        var embed = new Discord.MessageEmbed()
            .setTitle(":bookmark: Command executed :bookmark:")
            .setColor("#13afe8")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField("Channel", `#${message.channel.name}`, false)
            .addField("Command", `!${command}`, false)
        if (`!${command}` != message.content)
            embed.addField("Message", `${message.content.length > 1000 ? `${message.content.slice(0, 993)}...` : message.content}`, false)

        if (!isMaintenance())
            client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed] })
    }

    var userstats = userstatsList.find(x => x.id == message.author.id);
    if (!userstats) return

    userstats.statistics.commands++;

    userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

    //Wrapped
    var date = new Date();
    if (date.getFullYear() != 2022) return

    if (isMaintenance()) return

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

    if (!userstats.wrapped.commands[comando.name])
        userstats.wrapped.commands[comando.name] = 0

    userstats.wrapped.commands[comando.name] = userstats.wrapped.commands[comando.name] + 1

    userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
})

//Subscriber counter
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get(settings.idCanaliServer.codeSubscriberCounter)
        if (canale.name != `📱│GiulioAndCode: ${Math.floor(response.subscriberCount)}`)
            canale.setName(`📱│GiulioAndCode: ${Math.floor(response.subscriberCount)}`)
    })
}, 1000 * 60 * 5)
setInterval(function () {
    ytch.getChannelInfo("UCvIafNR8ZvZyE5jVGVqgVfA").then((response) => {
        var canale = client.channels.cache.get(settings.idCanaliServer.giulioSubscriberCounter)
        if (canale.name != `✌│Giulio: ${Math.floor(response.subscriberCount)}`)
            canale.setName(`✌│Giulio: ${Math.floor(response.subscriberCount)}`)
    })
}, 1000 * 60 * 5)

//Member counter
setInterval(function () {
    var server = client.guilds.cache.get(settings.idServer)
    var botCount = server.members.cache.filter(member => member.user.bot).size;
    var unverifiedCount = server.members.cache.filter(member => member.roles.cache.has(settings.idRuoloNonVerificato)).size;

    var utentiCount = server.memberCount - botCount - unverifiedCount;

    var canale = client.channels.cache.get(settings.idCanaliServer.memberCounter)
    if (canale.name != `👾│members: ${utentiCount}`)
        canale.setName(`👾│members: ${utentiCount}`)
}, 1000 * 60 * 5)

process.on("uncaughtException", err => {
    codeError(err);
})
process.on("unhandledRejection", err => {
    codeError(err);
})

//.setColor("#8227cc")
//.setColor("#ababab")
//.setColor("#22c90c")
//.setColor("#fcba03")
//.setColor("#e31705")