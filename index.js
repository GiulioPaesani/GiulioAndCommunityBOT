require('events').EventEmitter.prototype._maxListeners = 100;

const Discord = require("discord.js");
global.client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

const fs = require("fs");
const ytch = require('yt-channel-info');
const disbut = require('discord-buttons')(client);

client.login(process.env.token);

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
require("./functions/functions.js");

global.log = require("./config/log.json");

global.database = "";
global.url = `mongodb+srv://giulioandcode:${process.env.passworddb}@clustergiulioandcommuni.xqwnr.mongodb.net/test`;

global.lockdown = false;

global.serverstats = ""
global.userstatsList = ""

//CODES comando !code
global.client.codes = new Discord.Collection();
const codesFolder = fs.readdirSync("./code");
for (const file of codesFolder) {
    const code = require(`./code/${file}`);
    client.codes.set(code.name, code);
}

client.on("message", message => {
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
            .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")
            .setColor("#FF931E")
            .setDescription(`Il comando \`${prefix}${command}\` non esiste`)

        if (!utenteMod(message.member))//Se l"utente non è staff
            message.channel.send(embed)
                .then(msg => {
                    message.delete({ timeout: 15000 })
                    msg.delete({ timeout: 15000 })
                })
        return
    }

    let comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    //Verifica permesso
    if (comando.onlyStaff && !utenteMod(message.member)) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Non hai il permesso")
            .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
            .setColor("#9E005D")
            .setDescription(`Non puoi eseguire il comando \`${prefix}${command}\` perchè non hai il permesso`)

        message.channel.send(embed).then(msg => {
            message.delete({ timeout: 15000 })
            msg.delete({ timeout: 15000 })
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
                .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                .setColor("#F15A24")
                .setDescription(`Non puoi utilizzare il comando \`${prefix}${command}\` in questo canale`)
                .addField("Puoi usare questo comando in:", canaliConcessiLista)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 15000 }).catch(() => { return })
                msg.delete({ timeout: 15000 }).catch(() => { return })
            })
            return

        }

    }

    //Poter utilizzare solo !clear in #tutorial
    if (message.channel == config.idCanaliServer.tutorial && comando.name != "clear") return

    comando.execute(message, args, client);
})


//Counter youtube
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get(config.idCanaliServer.codeSubscriberCounter)
        canale.setName("📱│GiulioAndCode: " + response.subscriberCount)
    })
}, 1000 * 60 * 20)
setInterval(function () {
    ytch.getChannelInfo("UCvIafNR8ZvZyE5jVGVqgVfA").then((response) => {
        var canale = client.channels.cache.get(config.idCanaliServer.giulioSubscriberCounter)
        canale.setName("✌│Giulio: " + response.subscriberCount)
        console.log("ciao")
    })
}, 1000 * 60 * 1)

//Member counter
setInterval(function () {
    var server = client.guilds.cache.get(config.idServer);
    var botCount = server.members.cache.filter(member => member.user.bot).size;
    var utentiCount = server.memberCount - botCount;

    var canale = client.channels.cache.get(config.idCanaliServer.memberCounter)
    canale.setName("👾│members: " + utentiCount)
}, 1000 * 60 * 5)

process.on("uncaughtException", err => {
    codeError(err);
})
process.on("unhandledRejection", err => {
    codeError(err);
})