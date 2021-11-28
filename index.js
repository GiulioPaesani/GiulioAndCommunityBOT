require('events').EventEmitter.prototype._maxListeners = 100;

global.Discord = require("discord.js");
global.client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

const fs = require("fs");
global.ytch = require('yt-channel-info');
global.disbut = require('discord-buttons');
disbut(client);
global.moment = require("moment");
global.ms = require("ms");
global.humanNumber = require("human-number");
global.Parser = require('expr-eval').Parser;
global.MongoClient = require('mongodb').MongoClient;

client.login("ODAyMTg0MzU5MTIwODYzMjcy.YAriZw.Bi0AAwqpdvJ8TDjiPm9rFCG_79w");

global.config = require("./config/config.json");
var config = require("./config/config.json");

//COMMANDS
client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}
//EVENTS
const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventsFiles) {
        const event = require(`./events/${folder}/${file}`);
        client.on(event.name, (...args) => event.execute(...args));
    }
}
//FUNCTIONS
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
    require(`./functions/${file}`);
}

global.log = require("./config/log.json");

global.database = "";
global.url = `mongodb+srv://giulioandcode:giulio794396@clustergiulioandcommuni.xqwnr.mongodb.net/test`;

global.serverstats = ""
global.userstatsList = ""

global.usersIndividualSpam = new Map()
global.usersGroupSpam = new Map();

global.avventoJSON = require("./avvento.json")

//CODES comando !code
global.client.codes = new Discord.Collection();
const codesFolder = fs.readdirSync("./code");
for (const file of codesFolder) {
    const code = require(`./code/${file}`);
    client.codes.set(code.name, code);
}

client.on("message", async message => {
    const prefix = "!"
    if (message.channel.type == "dm") return //Messaggi in dm non accettati
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return;
    if (message.guild.id != config.idServer && message.guild.id != log.server) return
    if (!userstatsList) return


    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()

    trovata = getParolaccia(message.content)[0];
    if (trovata && !utenteMod(message.member)) return

    //Verifica esistenza comando
    if (!client.commands.has(command.toLowerCase()) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command.toLowerCase()))) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Comando non esistente")
            .setColor("#FF931E")
            .setDescription(`Il comando \`${prefix}${command}\` non esiste`)

        var data = new Date()
        if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
            embed.setThumbnail("https://i.postimg.cc/x1MgSvfQ/Not-Found-Halloween.png")
        }
        else {
            embed.setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")
        }

        if (!utenteMod(message.member)) //Se l"utente non è staff
            message.channel.send(embed)
                .then(msg => {
                    message.delete({ timeout: 15000 })
                        .catch(() => { })
                    msg.delete({ timeout: 15000 })
                        .catch(() => { })
                })
        return
    }

    let comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    //Verifica permesso
    if (comando.onlyStaff && !utenteMod(message.member)) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Non hai il permesso")
            .setColor("#9E005D")
            .setDescription(`Non puoi eseguire il comando \`${prefix}${command}\` perchè non hai il permesso`)

        var data = new Date()
        if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
            embed.setThumbnail("https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png")
        }
        else {
            embed.setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
        }

        message.channel.send(embed).then(msg => {
            message.delete({ timeout: 15000 })
                .catch(() => { })
            msg.delete({ timeout: 15000 })
                .catch(() => { })
        })
        return
    }

    //Verifica canale concesso
    if (comando.channelsGranted.length != 0 && !comando.channelsGranted.includes(message.channel.id) && !utenteMod(message.member)) {
        if (comando.name == "code" && (message.member.roles.cache.has(config.idRuoloAiutante) || message.member.roles.cache.has(config.idRuoloAiutanteInProva))) {

        } else {
            let canaliConcessiLista = "";
            comando.channelsGranted.forEach(idCanale => {
                canaliConcessiLista += `<#${idCanale}>\r`
            })

            let embed = new Discord.MessageEmbed()
                .setTitle("Canale non concesso")
                .setColor("#F15A24")
                .setDescription(`Non puoi utilizzare il comando \`${prefix}${command}\` in questo canale`)
                .addField("Puoi usare questo comando in:", canaliConcessiLista)

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/kXkwZ1dw/Not-Here-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
            }


            var day = new Date().getDate()
            var month = new Date().getMonth()

            if ((month == 11 || (month == 0 && day <= 6)) && serverstats.avvento[message.author.id] && serverstats.avvento[message.author.id][17] && comando.name != "say") {

            }
            else {
                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 15000 })
                        .catch(() => { })
                    msg.delete({ timeout: 15000 })
                        .catch(() => { })
                })
                return
            }
        }
    }

    //Poter utilizzare solo !clear in #tutorial
    if (message.channel == config.idCanaliServer.tutorial && comando.name != "clear") return

    await comando.execute(message, args, client);
})

//Subscriber counter
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get(config.idCanaliServer.codeSubscriberCounter)
        if (canale.name != `📱│GiulioAndCode: ${Math.floor(response.subscriberCount)}`)
            canale.setName(`📱│GiulioAndCode: ${Math.floor(response.subscriberCount)}`)
    })
}, 1000 * 60 * 20)
setInterval(function () {
    ytch.getChannelInfo("UCvIafNR8ZvZyE5jVGVqgVfA").then((response) => {
        var canale = client.channels.cache.get(config.idCanaliServer.giulioSubscriberCounter)
        if (canale.name != `✌│Giulio: ${Math.floor(response.subscriberCount)}`)
            canale.setName(`✌│Giulio: ${Math.floor(response.subscriberCount)}`)
    })
}, 1000 * 60 * 5)

//Member counter
setInterval(function () {
    var server = client.guilds.cache.get(config.idServer);
    var botCount = server.members.cache.filter(member => member.user.bot).size;
    var unverifiedCount = server.members.cache.filter(member => member.roles.cache.has(config.idRuoloNonVerificato)).size;

    var utentiCount = server.memberCount - botCount - unverifiedCount;


    var canale = client.channels.cache.get(config.idCanaliServer.memberCounter)
    if (canale.name != `👾│members: ${utentiCount}`)
        canale.setName(`👾│members: ${utentiCount}`)
}, 1000 * 60 * 5)

process.on("uncaughtException", err => {
    codeError(err);
})
process.on("unhandledRejection", err => {
    codeError(err);
})