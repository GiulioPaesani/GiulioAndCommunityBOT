require('events').EventEmitter.prototype._maxListeners = 200;

global.Discord = require("discord.js");
global.client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

const fs = require("fs");
global.ytch = require('yt-channel-info');
global.disbut = require('discord-buttons');
disbut(client);
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
client.on("message", async message => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return;
    if (!message.channel.type == "dm" && (message.guild.id != settings.idServer && message.guild.id != log.idServer)) return
    if (!userstatsList) return

    if (message.channel.id == log.general.thingsToDo) return

    if (isMaintenance(message.author.id)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase()

    if (!command[0]?.replace(/[^a-z]/g, "")) return

    trovata = getParolaccia(message.content)[0];
    if (trovata && !utenteMod(message.author)) return

    if (new Date().getDate() == 14 && new Date().getMonth() == 1 && (message.content.startsWith("!match") || message.content.startsWith("!secret"))) return

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
                client.channels.cache.get(log.commands.allCommands).send(embed)

            botCommandMessage(message, "ComandoNonEsistente")
        }
        return
    }

    let comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    //Verifica permesso
    if (comando.onlyStaff && !utenteMod(message.author)) {
        botCommandMessage(message, "NonPermesso")
        return
    }

    if (message.channel.type == "dm") {
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
                client.channels.cache.get(log.commands.allCommands).send(embed)

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
            client.channels.cache.get(log.commands.allCommands).send(embed)
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

const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont("./canvas/font/roboto.ttf", { family: "roboto" })
registerFont("./canvas/font/robotoBold.ttf", { family: "robotoBold" })

client.on("message", async message => {
    if (new Date().getDate() != 14 || new Date().getMonth() != 1) return

    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return;

    if (isMaintenance(message.author.id)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase()

    if (!command[0]?.replace(/[^a-z]/g, "")) return

    trovata = getParolaccia(message.content)[0];
    if (trovata && !utenteMod(message.author)) return

    if (message.content.startsWith("!match")) {
        if (message.channel.id != settings.idCanaliServer.commands) {
            botCommandMessage(message, "CanaleNonConcesso", "", "", { name: "match", channelsGranted: [settings.idCanaliServer.commands] })
            return
        }

        var utente1 = message.mentions.users?.first()
        if (utente1 && args[0].includes(utente1.id)) {
            var utente2 = message.mentions.users?.array()[1]
            if (!utente2) {
                var utente2 = await getUser(args[1])
            }
        }
        else {
            var utente1 = await getUser(args[0])
            var utente2 = message.mentions.users?.first()
            if (!utente2) {
                var utente2 = await getUser(args[1])
            }
        }

        if (!utente1 || !utente2) {
            return botCommandMessage(message, "Error", "Utenti non trovato o non validi", "Hai inseriti utenti non disponibili o non validi", { syntax: "!match [user1] [user2]" })
        }

        if (utente1.user) utente1 = utente1.user
        if (utente2.user) utente2 = utente2.user

        var canvas = await createCanvas(1000, 1000)
        var ctx = await canvas.getContext('2d')

        ctx.fillStyle = "#C74141";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var canvas2 = await createCanvas(1000, 1000)
        var ctx2 = await canvas2.getContext('2d')

        ctx2.beginPath();
        ctx2.arc(canvas2.width / 2, canvas2.height / 2, canvas2.width / 2, 0, 2 * Math.PI, true);
        ctx2.clip();

        var img = await loadImage(utente1.displayAvatarURL({ format: 'png' }))
        ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);

        var canvas3 = await createCanvas(1000, 1000)
        var ctx3 = await canvas3.getContext('2d')

        ctx3.beginPath();
        ctx3.arc(canvas3.width / 2, canvas3.height / 2, canvas3.width / 2, 0, 2 * Math.PI, true);
        ctx3.clip();

        var img = await loadImage(utente2.displayAvatarURL({ format: 'png' }))
        ctx3.drawImage(img, 0, 0, canvas3.width, canvas3.height);

        ctx.drawImage(canvas2, 50, 50, 500, 500);
        ctx.drawImage(canvas3, canvas.width - 50 - 500, canvas.height - 50 - 500, 500, 500);

        var img = await loadImage("https://i.postimg.cc/Fz9ngM2c/heart.png")
        ctx.drawImage(img, canvas.width / 2 - 300 / 2, canvas.height / 2 - 300 / 2, 300, 300);

        var embed = new Discord.MessageEmbed()
            .setTitle(`${utente1.username} ❤️ ${utente2.username}`)
            .setColor("#C74141")
            .setThumbnail("attachment://canvas.png")
            .setDescription(`Ecco la percentuale di **corrispondenza** tra ${utente1.toString()} e ${utente2.toString()}: **${Math.floor(Math.random() * 101)}%** `)

        message.channel.send({ embed: embed, files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
    }

    if (message.content.startsWith("!secret")) {
        if (message.channel.type != "dm") {
            return botCommandMessage(message, "Warning", "Scrivi in DM", "Puoi eseguire questo comando solo nei DM del bot, in modo da scrivere in modo anonimo", { syntax: "!secret [user] [text]" })
        }

        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args[0])
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Inserisci un utente valido a cui vuoi mandare anoninamente un messaggio", { syntax: "!secret [user] [text]" })
        }

        if (utente.id == message.author.id) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi scriverti un messaggio segreto da solo", { syntax: "!secret [user] [text]" })
        }

        var testo = args.slice(1).join(" ");

        if (!testo) {
            return botCommandMessage(message, "Error", "Inserire un messaggio", "Scrivi il messaggio che vuoi mandare anonimamente all'utente", { syntax: "!secret [user] [text]" })
        }

        if (testo.length > 500) {
            return botCommandMessage(message, "Warning", "Messaggio troppo lungo", "Puoi scrivere un messaggio di massimo 500 caratteri", { syntax: "!secret [user] [text]" })
        }

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setTitle(":shushing_face: Confermi il messaggio segreto?")
            .setColor("#ebaa13")
            .setDescription(`Conferma il messaggio per ${utente.toString()} con il bottone qua sotto
\`\`\`${testo}\`\`\`
Una volta inviato il messaggio a ${utente.username}, **NESSUNO** saprà chi lo ha inviato, quindi sarai completamente **anonimo**`)

        var button1 = new disbut.MessageButton()
            .setLabel("Annulla")
            .setStyle("red")
            .setID(`annullaCompleanno,${message.author.id}`)

        var button2 = new disbut.MessageButton()
            .setLabel("Conferma messaggio")
            .setStyle("green")
            .setID(`confermaSegreto,${utente.id}`)

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        message.channel.send(embed, row)
    }
})

client.on("clickButton", button => {
    if (button.id.startsWith("confermaSegreto")) {
        var utente = client.users.cache.get(button.id.split(",")[1])

        var embed = new Discord.MessageEmbed()
            .setTitle(":shushing_face: Messaggio segreto :shushing_face:")
            .setColor("#8227cc")
            .setDescription(`Ti è arrivato un messaggio **anonimo** da una persona segreta:
\`\`\`${button.message.embeds[0].description.split("```")[1]}\`\`\`
**Nessuno** sa da chi è scritto questo messaggio`)

        utente.send(embed)
            .catch(() => { })

        var embed = new Discord.MessageEmbed()
            .setTitle(":shushing_face: Messaggio segreto INVIATO :shushing_face:")
            .setColor("#22c90c")
            .setDescription(`Il messaggio anonimo per ${utente.toString()} è stato inviato con successo
\`\`\`${button.message.embeds[0].description.split("```")[1]}\`\`\`
**Nessuno** saprà mai il creatore di questo messaggio`)

        button.message.edit(embed, null)
    }
})