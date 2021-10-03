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
    })
}, 1000 * 60 * 5)

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


var prefix = "-"
client.on("message", async (message) => {
    //if in a dm or msg from a bot, return 
    if (!message.guild || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd == "help") {
        //define help Embed
        let embed = new Discord.MessageEmbed()
            .setTitle("All Commands")
            .setURL("https://www.npmjs.com/package/discord-youtube-poster")
            .setColor("RED")
            .addField(`${prefix}set`, `> *Set a setup Channel with a CHANNELLINK, DCCHAT, DCUSER and a MESSAGE*`, true)
            .addField(`${prefix}edit`, `> *Edit a setup Channel with a CHANNELLINK, DCCHAT, DCUSER and a MESSAGEK*`, true)
            .addField(`${prefix}remove`, `> *Delete/Remove a setup Channel by a CHANNELLINK*`, true)
            .addField(`${prefix}get`, `> *Get a setup Channel by a CHANNELLINK*`, true)
            .addField(`${prefix}getuser`, `> *Get all setup Channels of a USER*`, true)
            .addField(`${prefix}getallchannels`, `> *Get all setup Channels of this Guild*`, true)
            .addField(`${prefix}deleteallchannels`, `> *Delete/Remove all setup Channels of this Guild*`, true)
            .addField(`${prefix}channelinfo`, `> *Get detailed YT-Channel-Data by a CHANNELLINK*`, true)
            .addField(`${prefix}latestvideos`, `> *Get all/latest Videos by a CHANNELLINK*`, true)
            .addField(`${prefix}lastvideo`, `> *Get the most recent uploaded Video by a CHANNELLINK*`, true)
            .setFooter(`npm i discord-youtube-poster\nDC-HELP: https://discord.gg/FQGXbypRf8`)
        //Send the Information Message
        message.channel.send({
            content: `**\`\`\`npm i discord-youtube-poster\`\`\`**\nDC-HELP: https://discord.gg/FQGXbypRf8\nhttps://www.npmjs.com/package/discord-youtube-poster\n\n**DOCS:**\nhttps://github.com/Tomato6966/discord-yt-poster/wiki/`,
            embed: embed
        }).then(msg => msg.react("👍"))
    }

    //All possible replacement formats, see them: https://github.com/Tomato6966/discord-yt-poster/wiki/Replacement Formats
    let toreplace_format =
        `**\`{videourl}\` ==> URL / LINK**` + "\n" +
        `**\`{video}\` ==> URL / LINK**` + "\n" +
        `**\`{url}\` ==> URL / LINK**` + "\n" +
        `**\`{videotitle}\` ==> TITLE / NAME**` + "\n" +
        `**\`{name}\` ==> TITLE / NAME**` + "\n" +
        `**\`{title}\` ==> TITLE / NAME**` + "\n" +
        `**\`{videoauthorname}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{authorname}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{author}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{creator}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{creatorname}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{discorduser}\` ==> ID of the LINKED USER**` + "\n" +
        `**\`{user}\` ==> ID of the LINKED USER**` + "\n" +
        `**\`{member}\` ==> ID of the LINKED USER**` + "\n\n" +
        `**__DEFAULT MESSAGE:__** \`\`\`${client.YTP.options.defaults.Notification}\`\`\``;


    if (cmd === "set" || cmd === "add" || cmd === "youtube") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(":x: You are not allowed to execute this Command!")
        })
        let ChannelLink = args[0];
        let DiscordChannel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first() || message.guild.channels.cache.get(args[1]);
        let DiscordUser = message.mentions.members.filter(m => m.guild.id == message.guild.id).first()?.user || message.guild.members.cache.get(args[2])?.user;
        let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        let preventDuplicates = true;
        if (!ChannelLink || !DiscordChannel || !DiscordUser) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(`:x: Usage: \`${prefix}set <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
        })
        //set a Channel
        client.YTP.setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification, preventDuplicates = true)
            .then(ch => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send the information
                message.channel.send({
                    embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`I will now post Notifications for ${ch.YTchannel} (<@${ch.DiscordUser}>) in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
    }

    if (cmd === "edit" || cmd === "change" || cmd === "adjust") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(":x: You are not allowed to execute this Command!")
        })
        let ChannelLink = args[0];
        let DiscordChannel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first() || message.guild.channels.cache.get(args[1]);
        let DiscordUser = message.mentions.members.filter(m => m.guild.id == message.guild.id).first()?.user || message.guild.members.cache.get(args[2])?.user;
        let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        if (!ChannelLink || !DiscordChannel || !DiscordUser) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(`:x: Usage: \`${prefix}edit <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
        })
        //Edit a Channel
        client.YTP.editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification)
            .then(ch => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send information message
                message.channel.send({
                    embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`I changed the Settings for ${ch.YTchannel} (<@${ch.DiscordUser}>), posting in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
    }

    if (cmd === "remove" || cmd === "delete" || cmd == "del") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(":x: You are not allowed to execute this Command!")
        })
        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}del <LINK>`)
        //Delete a Channel
        client.YTP.deleteChannel(message.guild.id, ChannelLink)
            .then(ch => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send information message
                message.channel.send({
                    embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`I deleted the Settings for ${ch.deletedChannel.YTchannel} (<@${ch.deletedChannel.DiscordUser}>), posting in <#${ch.deletedChannel.DiscordChannel}>\n\nThe Message:\n${ch.deletedChannel.message}`)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
    }

    if (cmd === "get" || cmd === "details" || cmd === "info") {
        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}get <LINK>\``)
        //get a Channel
        client.YTP.getChannel(message.guild.id, ChannelLink).then(ch => {
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send the Information Message
            message.channel.send({
                embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`**Guild:**\n> **\`${client.guilds.cache.get(ch.DiscordGuild).name}\`**` + "\n" +
                    `**Channel to Post:**\n> **${message.guild.channels.cache.get(ch.DiscordChannel)}**` + "\n" +
                    `**Channel Link:**\n> **${ch.YTchannel}**` + "\n" +
                    `**Linked User:**\n> **\`${message.guild.members.cache.get(ch.DiscordUser).user.tag}\`**` + "\n" +
                    `**Last Video:**\n> **\`https://youtube.com/watch=?v${ch.oldvid}\`**` + "\n" +
                    `**Message:**\n>>> \`\`\`${ch.message}\`\`\``)
            }).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })
    }

    if (cmd === "getuser" || cmd === "userdetails" || cmd === "userinfoinfo") {
        let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
        if (!user) user = message.author;
        //get all channels for a User, instead of using a Link
        client.YTP.getChannels4User(message.guild.id, user).then(chs => {
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send information, you could do a chs.map(ch=>ch.YTchannel)...
            message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription(`**__All Links__**\n\`\`\`${chs.map(ch => ch.YTchannel).join("\n")}\`\`\``)).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })
    }

    if (cmd === "getallchannels") {
        //get all channels
        client.YTP.getAllChannels(message.guild.id)
            .then(chs => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send information, you could do a chs.map(ch=>ch.YTchannel)...
                message.channel.send({
                    embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`There are ${chs.length} Channels Setupped!`)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
    }

    if (cmd === "deleteallchannels") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(":x: You are not allowed to execute this Command!")
        })
        //delete all channels method
        client.YTP.deleteAllChannels(message.guild.id)
            .then(data => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send a successmessage
                message.channel.send({
                    embed: new Discord.MessageEmbed().setColor("GREEN").setDescription(`I deleted ${data.deletedChannels.length} Channels`)
                }).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })
    }


    //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
    if (cmd === "channelinfo") {
        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}channelinfo <LINK>\``)
        //get Channel Information
        client.YTP.getChannelInfo(ChannelLink).then(Channel => {
            //console.log(Channel) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //Define the Embed
            let embed = new Discord.MessageEmbed()
                .setTitle(Channel.name)
                .setURL(Channel.url)
                .setColor("RED")
                .addField("**Subscribercount:**", "`" + Channel.subscribers + "`")
                .addField("**Tags:**", Channel.tags.map(t => `\`${t}\``).join(",  "))
                .addField("**Unlisted:**", Channel.unlisted ? "✅" : "❌", true)
                .addField("**FamilySafe:**", Channel.familySafe ? "✅" : "❌", true)
                .setFooter("ID: " + Channel.id)
                .setImage(Channel.mobileBanner[0]?.url)
                .setDescription(String(Channel.description).substr(0, 1500))
            //Send the Message
            message.channel.send({
                embed: embed
            }).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })
    }

    //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
    if (cmd === "latestvideos" || cmd == "allvideos") {
        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}latestVideos <LINK>\``)
        //get the Latest Videos
        client.YTP.getLatestVideos(ChannelLink).then(Videos => {
            //console.log(Videos) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //define the Embed
            let embed = new Discord.MessageEmbed()
                .setTitle(`Videos of ${Videos[0].author}`)
                .setColor("RED")
                .setURL(ChannelLink)
            //For Each Video, add a new Field (just the first 10 Videos!)
            Videos.forEach((v, i) => {
                if (i < 10) {
                    embed.addField(v.title, `[Watch it](${v.link}) | Published at: \`${v.pubDate}\``)
                }
            })
            //Send the Message
            message.channel.send({
                embed: embed
            }).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })
    }

    //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
    if (cmd === "lastvideo") {
        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send({
            embed: new Discord.MessageEmbed().setColor("RED").setDescription(`:x: Usage: \`${prefix}lastVideo <LINK>\``)
        })
        //get the latest videos
        client.YTP.getLatestVideos(ChannelLink).then(videos => {
            let video = videos[0]
            let time = new Date(video.pubDate)
            //define the embed
            let embed = new Discord.MessageEmbed()
                .setTitle(video.title)
                .setURL(video.link)
                .setColor("RED")
                .setFooter(`ID: ${video.id}`)
                .setTimestamp(time.getTime())
            //Send the Message
            message.channel.send({
                content: `${video.link}`,
                embed: embed
            }).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })
    }
});