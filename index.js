const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const { Permissions } = require('discord.js');
const ytch = require('yt-channel-info');
const fetch = require("node-superfetch")
const mysql = require('mysql');
const moment = require('moment');

const config = require("./config.json");

client.login(process.env.token);

//Connessione database
var con = mysql.createPool({
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'b0e6f9bf85a35f',
    password: process.env.passworddb,
    database: 'heroku_e1befae4f922504'
})

var userstatsList, serverstats;
var suggestions, challenges;
var uptime;
var lockdown = false;

var embedSuggestion = new Discord.MessageEmbed();
var embedChallenge = new Discord.MessageEmbed();

client.on("ready", () => {
    console.log("----- GiulioAndCommunity BOT è ONLINE! -----");

    client.user.setActivity('!help', { type: 'WATCHING' });

    con.query("SELECT * FROM userstats", (err, result) => {
        if (err)
            codeError(err)

        userstatsList = result
    })
    con.query("SELECT * FROM serverstats", (err, result) => {
        if (err)
            codeError(err)

        serverstats = result[0]
        suggestions = JSON.parse(serverstats.suggestions)
        challenges = JSON.parse(serverstats.challenges)
    })

    uptime = new Date();
})

function codeError(err) {
    var embed = new Discord.MessageEmbed()
        .setTitle("ERROR")
        .setThumbnail("https://images-ext-1.discordapp.net/external/8DoN43XFJZCFvTRZXpq443nx7s0FaLVesjgSNnlBTec/https/i.postimg.cc/zB4j8xVZ/Error.png?width=630&height=630")
        .setColor("#ED1C24")
        .setDescription(err)
        .addField(":alarm_clock: Uptime", moment(uptime).fromNow(true))

    var utente = client.users.cache.get(config.idGiulio);
    utente.send(embed);
    console.log(err)
}
function permesso(message, comando) {
    var embed = new Discord.MessageEmbed()
        .setTitle("Non hai il permesso")
        .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
        .setColor("#9E005D")
        .setDescription(`Non puoi eseguire il comando \`${comando}\` perchè non hai il permesso`)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 10000 }).catch()
        msg.delete({ timeout: 10000 }).catch()
    })
}
function error(message, title, description) {
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
        .setColor("#ED1C24")
        .setDescription(description)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 10000 }).catch()
        msg.delete({ timeout: 10000 }).catch()
    })
}
function warming(message, title, description) {
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
        .setColor("#8F8F8F")
        .setDescription(description)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 10000 }).catch()
        msg.delete({ timeout: 10000 }).catch()
    })
}
function correct(message, title, description) {
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
        .setColor("#16A0F4")
        .setDescription(description)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 10000 }).catch()
        msg.delete({ timeout: 10000 }).catch()
    })
}

client.on("message", async (message) => {
    var utenteMod = false;
    try {
        if (message.author.bot) return //Bot non accettati
        if (message.channel.type == "dm") return //Messaggi in dm non accettati

        if (message.guild.id != config.idGiulioAndCommunity) return //Server sconosciuti non accettati

        message.content = message.content.trim().toLowerCase();

        if (message.channel == config.idCanaliServer.tutorial && !message.content.startsWith("!clear")) return //Poter utilizzare !clear in #tutorial

        //Eliminare messaggi se non comandi in #suggestions e #challenges
        if (message.channel.id == config.idCanaliServer.suggestions && !message.content.startsWith("!suggest") && !message.content.startsWith("!suggerisci") && !message.content.startsWith("!suggerimento")) {
            message.delete({ timeout: 10000 })
        }
        if (message.channel.id == config.idCanaliServer.challenges && !message.content.startsWith("!challenge") && !message.content.startsWith("!sfida")) {
            message.delete({ timeout: 10000 })
        }

        //REACTION MESSAGE
        if (message.content == "wow")
            message.react("<:GiulioWow:830376945107206174>")
        if (message.content == "rip")
            message.react("<:GiulioRip:809526422758490163>")
        if (message.content == "sad" || message.content == "piango" || message.content == "triste" || message.content == "sono triste")
            message.react("<:GiulioPiangere:809526423886364722>")
        if (message.content == "ok" || message.content == "okay")
            message.react("<:GiulioOK:820026506024714310>")
        if (message.content == "love" || message.content == "amore" || message.content == "ti amo")
            message.react("<:GiulioLove:809526404373807154>")
        if (message.content == "lol")
            message.react("<:GiulioLOL:820012281693077554>")
        if (message.content == "ciao" || message.content == "hi" || message.content == "hello")
            message.react("<:GiulioHi:809526403832872980>")
        if (message.content == "gg")
            message.react("<:GiulioGG:809526405929893900>")
        if (message.content == "f")
            message.react("<:GiulioF:820012279079763979>")
        if (message.content == "cosa?" || message.content == "non ho capito" || message.content == "cosa? non ho capito")
            message.react("<:GiulioDomandoso:809526406555238512>")
        if (message.content == "buonanotte" || message.content == "notte" || message.content == "buona notte" || message.content == "ho sonno")
            message.react("<:GiulioBuonanotte:809526879048040459>")
        if (message.content == "cool" || message.content == "figo")
            message.react("<:GiulioCool:809526407268794418>")
        if (message.content == "ban")
            message.react("<:GiulioBan:809526406442123325>")

        //Utente mod
        config.ruoliMod.forEach(ruolo => {
            if (message.member.roles.cache.has(ruolo)) utenteMod = true;
        })

        //Controllo comando e canale
        var comando; //Comando utilizzato
        var canaleConcesso = false; //Se canale concesos
        var canaliConcessiLista = ""; //Lista di canali concessi
        for (var command in config.comandi) {
            if (command[0] == "!") {
                if (message.content == command) {
                    comando = command;

                    //Controllo canale concesso
                    var lenght = 0;
                    if (config.comandi[command]) {
                        config.comandi[command].forEach(canale => {
                            if (message.channel.id == canale)
                                canaleConcesso = true;
                            lenght++;
                            canaliConcessiLista += `<#${canale}>\r`;
                        })
                    }
                    if (lenght == 0)
                        canaleConcesso = true;
                }
            }
            else {
                if (message.content.split(/\s+/)[0] == command.slice(1)) {
                    comando = command.slice(1);

                    //Controllo canale concesso
                    var lenght = 0;
                    if (config.comandi[command]) {
                        config.comandi[command].forEach(canale => {
                            if (message.channel.id == canale)
                                canaleConcesso = true;
                            lenght++;
                            canaliConcessiLista += `<#${canale}>\r`;
                        })
                    }
                    if (lenght == 0)
                        canaleConcesso = true;
                }
            }
        }

        if (!comando && message.content[0] == "!" && message.content[1] != "!" && !utenteMod) { //Comando inesistente
            var embed = new Discord.MessageEmbed()
                .setTitle("Comando non esistente")
                .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")
                .setColor("#FF931E")
                .setDescription("Il comando `" + message.content.split(/\s+/)[0] + "` non esiste")
            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 10000 }).catch()
                msg.delete({ timeout: 10000 }).catch()
            })
            return
        }

        if (comando && !canaleConcesso && !utenteMod) { //Canale non concesso
            var embed = new Discord.MessageEmbed()
                .setTitle("Canale non concesso")
                .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                .setColor("#F15A24")
                .setDescription("Non puoi utilizzare il comando `" + comando + "` in questo canale")
                .addField("Puoi usare questo comando in:", canaliConcessiLista)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 10000 }).catch()
                msg.delete({ timeout: 10000 }).catch()
            })
            return
        }

        //TEST
        if (message.content == "!test") {
            if (!utenteMod) {
                permesso(message, "!test");
                return
            }

            var testo = "";
            var GiulioAndCommunityBOT = message.guild.members.cache.get(config.idBot.community)
            var GiulioAndTutorial = message.guild.members.cache.get(config.idBot.tutorial)
            var GiulioAndModeration = message.guild.members.cache.get(config.idBot.moderation)
            var GiulioAndFun = message.guild.members.cache.get(config.idBot.fun)
            var GiulioAndLeveling = message.guild.members.cache.get(config.idBot.leveling)

            if (GiulioAndCommunityBOT.presence.status == "online") {
                testo += "<:GiulioAndCommunityBOT:823196000650788944> GiulioAndCommunity BOT - ONLINE 🟢\r"
            }
            else {
                testo += "<:GiulioAndCommunityBOT:823196000650788944> GiulioAndCommunity BOT - OFFLINE 🔴\r"
            }

            if (GiulioAndModeration.presence.status == "online") {
                testo += "<:GiulioAndModeration:823196000721960990> GiulioAndModeration - ONLINE 🟢\r"
            }
            else {
                testo += "<:GiulioAndModeration:823196000721960990> GiulioAndModeration - OFFLINE 🔴\r"
            }

            if (GiulioAndFun.presence.status == "online") {
                testo += "<:GiulioAndFun:823196000704528424> GiulioAndFun - ONLINE 🟢\r"
            }
            else {
                testo += "<:GiulioAndFun:823196000704528424> GiulioAndFun - OFFLINE 🔴\r"
            }

            if (GiulioAndLeveling.presence.status == "online") {
                testo += "<:GiulioAndLeveling:823196001153187841> GiulioAndLeveling - ONLINE 🟢\r"
            }
            else {
                testo += "<:GiulioAndLeveling:823196001153187841> GiulioAndLeveling - OFFLINE 🔴\r"
            }

            if (GiulioAndTutorial.presence.status == "online") {
                testo += "<:GiulioAndTutorial:823196000922894387> GiulioAndTutorial - ONLINE 🟢\r"
            }
            else {
                testo += "<:GiulioAndTutorial:823196000922894387> GiulioAndTutorial - OFFLINE 🔴\r"
            }

            var embed = new Discord.MessageEmbed()
                .setColor("#78B159")
                .addField("Stato di tutti i bot ufficiali", testo)

            message.channel.send(embed)
        }

        //BUG REPORT
        if (message.content.startsWith("!bug") || message.content.startsWith("!report")) {
            if (message.content.startsWith("!bug"))
                var report = message.content.slice(5).trim()
            if (message.content.startsWith("!report"))
                var report = message.content.slice(8).trim()

            if (!report && !(message.attachments).array()[0]) {
                error(message, "Inserire un report", "`!bug [report]`")
                return
            }

            var embed = new Discord.MessageEmbed()
                .setTitle("Bug reportato")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .addField(":bust_in_silhouette: User", "```" + message.member.user.tag + "```", false)

            if (report)
                embed.addField(":beetle: Bug", "```" + report + "```", false)

            message.delete({ timeout: 10000 });

            if ((message.attachments).array()[0])
                embed.setImage((message.attachments).array()[0].url)

            message.channel.send(embed)
                .then((msg) => {
                    msg.delete({ timeout: 10000 })
                })

            var canale = client.channels.cache.get(config.idCanaliServer.admin);
            canale.send(embed);
        }

        //HELP
        if (message.content == "!help" || message.content == "!aiuto" || message.content == "!comandi") {
            var totalPage = 7;
            var page = 1;

            var page1 = new Discord.MessageEmbed()
                .setTitle(":bar_chart: STATISTICS")
                .setDescription("Tutti i comandi relativi alle statistiche sul server, utenti e altro")
                .setColor("#6F9C56")
                .addField("!userstats (user)", `
Informazioni complete su un utente
_Alias: \`!user\` \`!userinfo\`_
        `)
                .addField("!serverstats", `
Informazioni complete sul server
_Alias: \`!server\` \`!serverinfo\`_
        `)
                .addField("!rolestats [role]", `
Informazioni complete su un ruolo
_Alias: \`!role\` \`!roleinfo\`_
        `)

                .addField("!channelstats (channel)", `
Informazioni complete su un canale
_Alias: \`!channel\` \`!channelinfo\`_
        `)
                .addField("!avatar (user)", `
        Ottenere l'immagine profilo di un utente
                `)
                .setFooter("Page 1/" + totalPage)

            var page2 = new Discord.MessageEmbed()
                .setTitle(":anchor: SERVER COMMANDS")
                .setDescription("Tutti i comandi specifici del server o del canale")
                .setColor("#2C5B7F")
                .addField("!youtube", `
Ottenere il link del canale YouTube di GiulioAndCode
    `)
                .addField("!lastvideo", `
Ultimo video uscito su GiulioAndCode
_Alias: \`!ultimovideo\`_
    `)
                .addField("!youtubestats", `
Statistiche e informazioni sul canale YouTube di GiulioAndCode
_Alias: \`!youtubeinfo\`_
    `)

                .addField("!twitch", `
Ottenere il link del canale Twitch di GiulioAndCode
_Alias: \`!live\` \`!giulioandlive\`_
    `)
                .addField("!github", `
Tutti i link github dei bot e altri progetti di GiulioAndCode
            `)

                .addField("!code (codice)", `
Comandi, spiegazioni e tutorial di molte funzioni in discord.js
            `)

                .addField("!bug [report]", `
Reportare un bug o anomali nei bot o nel server
_Alias: \`!report\`_
            `)
                .addField("!config", `
Attivare o disattivare le notifiche specifiche nel server
_Alias: \`!notifiche\` \`!notification\` \`!notifications\`_
            `)
                .addField("!invite", `
Ottenere il link d'invito per il server
            `)

                .setFooter("Page 2/" + totalPage)

            var page3 = new Discord.MessageEmbed()
                .setTitle(":joy: FUN")
                .setDescription("Tutti i comandi dei minigame o funzioni più divertenti")
                .setColor("#FFCC4D")
                .addField("!cuserstats (user)", `
Informazioni complete su un utente in Counting
_Alias: \`!cuser\` \`!cuserinfo\`_
`)
                .addField("!cserverstats", `
Informazioni complete sul server in Counting
_Alias: \`!cserver\` \`!cserverinfo\`_
`)
                .addField("!cset [count]", `
Settare un numero in Counting
`)
                .addField("!say [text]", `
Far scrivere al bot qualsiasi cosa
`)
                .setFooter("Page 3/" + totalPage)

            var page4 = new Discord.MessageEmbed()
                .setTitle(":bulb: SUGGESTIONS")
                .setDescription("Tutti i comandi sui suggerimenti e sfide")
                .setColor("#AEBCC6")
                .addField("!suggest [suggerimento]", `
Suggerire un cambiamento, funzione o comando nel server o nel canale
_Alias: \`!suggerisci\` \`!suggerimento\`_
`)
                .addField("!challenge [sfida]", `
Proporre una sfida
_Alias: \`!sfida\`_
`)
                .addField("!sremove [code]", `
Eliminare un suggerimento
`)
                .addField("!cremove [code]", `
Eliminare una sfida
`)
                .setFooter("Page 4/" + totalPage)

            var page5 = new Discord.MessageEmbed()
                .setTitle(":moneybag: LEVELING")
                .setDescription("Tutti i comandi sul livellamento")
                .setColor("#E2A871")
                .addField("!rank (user)", `
Informazioni sul livello di un utente
_Alias: \`!level\`_
`)
                .addField("!leaderboard", `
Statistica completa di tutti gli utenti
_Alias: \`!lb\`_
`)
                .addField("!setlevel [user]", `
Impostare un livello a un utente
`)
                .setFooter("Page 5/" + totalPage)

            var page6 = new Discord.MessageEmbed()
                .setTitle(":tickets: TICKET")
                .setDescription("Tutti i comandi sul sistema di ticket")
                .setColor("#CF394F")
                .addField("!tclose", `
Chiudere un ticket
`)
                .addField("!tadd [user]", `
Aggiungere un utente al ticket
`)
                .addField("!tremove [user]", `
Rimuovere un utente dal ticket
`)
                .setFooter("Page 6/" + totalPage)

            var page7 = new Discord.MessageEmbed()
                .setTitle(":crossed_swords: MODERATION")
                .setDescription("Tutti i comandi sulla moderazione nel server")
                .setColor("#8F4A33")
                .addField("!warn [user] (reason)", `
Richiamare un utente
`)
                .addField("!clearwarn [user] (code)", `
Cancellare i richiami di un utente
_Alias: \`!clearinfractions\` \`!clearinfraction\` \`!clearinfrazioni\`_
`)
                .addField("!infractions (user)", `
Tutti i richiami di un utente
_Alias: \`!infraction\` \`!infrazioni\`_
`)
                .addField("!kick [user] (reason)", `
Espellere un utente dal server
`)
                .addField("!mute [user] (reason)", `
Mutare un utente
`)
                .addField("!tempmute [user] [time] (reason)", `
Mutare un utente temporaneamente
`)
                .addField("!unmute [user]", `
Smutare un utente
`)
                .addField("!ban [user] (reason)", `
Bannare un utente
`)
                .addField("!tempban [user] [time] (reason)", `
Bannare un utente temporaneamente
`)
                .addField("!unban [user]", `
Sbannare un utente
`)
                .addField("!lockdown", `
Attivare il sistema di lockdown
`)
                .addField("!slowmode [time]", `
Settare la slowmode in un canale
`)
                .addField("!clear [count]", `
Cancellare messaggi predenti dal comando
`)
                .setFooter("Page 7/" + totalPage)

            message.channel.send(page1).then(msg => {
                msg.react('◀').then(r => {
                    msg.react('▶')

                    // Filters
                    const reactIndietro = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id
                    const reactAvanti = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id

                    const paginaIndietro = msg.createReactionCollector(reactIndietro)
                    const paginaAvanti = msg.createReactionCollector(reactAvanti)

                    paginaIndietro.on('collect', (r, u) => {
                        page--
                        page < 1 ? page = totalPage : ""
                        msg.edit(eval("page" + page))
                        r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    })
                    paginaAvanti.on('collect', (r, u) => {
                        page++
                        page > totalPage ? page = 1 : ""
                        msg.edit(eval("page" + page))
                        r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    })
                })
            })


        }

        //YOUTUBE
        if (message.content == "!youtube") {
            ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
                var youtube = new Discord.MessageEmbed()
                    .setTitle("GiulioAndCode")
                    .setColor("#41A9F6")
                    .setURL(response.authorUrl)
                    .setDescription(":love_you_gesture: Questo è il canale youtube **GiulioAndCode**\rIscriviti, lascia like, e attiva la campanellina")
                    .setThumbnail("https://i.postimg.cc/fLLYRp8J/Profilo2-PNG.png")
                message.channel.send(youtube);
            })
        }
        //LAST VIDEO
        if (message.content == "!lastvideo" || message.content == "!ultimovideo") {
            const channelId = 'UCK6QwAdGWOWN9AT1_UQFGtA'
            const sortBy = 'newest'
            ytch.getChannelVideos(channelId, sortBy).then((response) => {
                var lastVideo = new Discord.MessageEmbed()
                    .setTitle(response.items[0].title)
                    .setColor("#41A9F6")
                    .setURL("https://www.youtube.com/watch?v=" + response.items[0].videoId)
                    .setDescription(":love_you_gesture: Questo è l'ultimo video uscito su **GiulioAndCode**, vai subito a vederlo...\r :point_right:  https://www.youtube.com/watch?v=" + response.items[0].videoId)
                    .setThumbnail(response.items[0].videoThumbnails[3].url)
                    .addField(":eyes: Views", "```" + response.items[0].viewCount + "```", true)
                    .addField(":film_frames: Duration", "```" + response.items[0].durationText + "```", true)
                    .addField(":alarm_clock: Published", "```" + response.items[0].publishedText + "```", true)

                message.channel.send(lastVideo)
            })
        }
        //YOUTUBESTATS
        if (message.content == "!youtubestats" || message.content == "!youtubeinfo") {
            const channel = await fetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=GiulioAndCode&key=AIzaSyAoPIQMri9i6iqvJKZX5rulsM3LWYyCjsk&maxResults=1&type=channel`)

            const data = await fetch.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channel.body.items[0].id.channelId}&key=AIzaSyAoPIQMri9i6iqvJKZX5rulsM3LWYyCjsk`)

            var embed = new Discord.MessageEmbed()
                .setTitle("YOUTUBESTATS - GiulioAndCode")
                .addField(":eyes: Views", "```" + data.body.items[0].statistics.viewCount + "```", true)
                .addField(":busts_in_silhouette: Subscriber", "```" + data.body.items[0].statistics.subscriberCount + "```", true)
                .addField(":film_frames: Video", "```" + data.body.items[0].statistics.videoCount + "```", true)
                .addField(":page_facing_up: Description", "```" + data.body.items[0].brandingSettings.channel.description + "```", false)
                .addField(":alarm_clock: Channel created", "```" + new Date(JSON.parse(data.text).items[0].snippet.publishedAt).toDateString() + " " + new Date(JSON.parse(data.text).items[0].snippet.publishedAt).getHours() + ":" + new Date(JSON.parse(data.text).items[0].snippet.publishedAt).getMinutes() + " (" + moment(new Date(JSON.parse(data.text).items[0].snippet.publishedAt).getTime()).fromNow() + ")```", true)
                .addField(":pencil: Channel keywords", "```" + data.body.items[0].brandingSettings.channel.keywords + "```", false)

            message.channel.send(embed)

        }
        //TWITCH
        if (message.content == "!twitch" || message.content == "!live" || message.content == "!giulioandlive") {
            var embed = new Discord.MessageEmbed()
                .setTitle("GiulioAndCode - Twitch")
                .setColor("#9147FF")
                .setURL("https://www.twitch.tv/giulioandcode")
                .setDescription(":purple_circle: Questo è il mio canale **Twitch**\rSeguimi anche li per non perderti live divertenti, ma soprattutto cringe\r\rSe ti va seguimi anche su [GiulioAndLive](https://www.youtube.com/channel/UCdwJnxZFfggSuXrLrc5sfPg) per gli estratti delle migliori live")
                .setThumbnail("https://i.postimg.cc/XqjcdXN7/Profilo-PNG.png")
            message.channel.send(embed);
        }

        //GITHUB
        if (message.content == "!github") {
            var embed = new Discord.MessageEmbed()
                .setTitle("GITHUB")
                .setDescription(`Questi sono tutti i link Github di GiulioAndCode
                
                <:GiulioAndCommunityBOT:823196000650788944> GiulioAndCommunity BOT - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndCommunityBOT)
                <:GiulioAndModeration:823196000721960990> GiulioAndModeration - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndModeration)
                <:GiulioAndFun:823196000704528424> GiulioAndFun - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndFun)
                <:GiulioAndLeveling:823196001153187841> GiulioAndLeveling - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndLeveling)
                <:GiulioAndTutorial:823196000922894387> GiulioAndTutorial - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndTutorial)`)
                .setThumbnail("https://i.postimg.cc/mrXPWCHK/Senza-titolo-1.jpg")

            message.channel.send(embed)
        }

        //SERVERINFO
        if (message.content == "!server" || message.content == "!serverstats" || message.content == "!serverinfo") {
            var server = message.member.guild;
            var botCount = server.members.cache.filter(member => member.user.bot).size
            var memberCount = server.memberCount - botCount;

            var categoryCount = server.channels.cache.filter(c => c.type == "category").size;
            var textCount = server.channels.cache.filter(c => c.type == "text").size;
            var vocalCount = server.channels.cache.filter(c => c.type == "voice").size;

            var serverStats = new Discord.MessageEmbed()
                .setTitle(server.name)
                .setDescription("Tutte le statistiche su questo server")
                .setThumbnail(server.iconURL({ dynamic: true }))
                .addField(":technologist: Owner", "```" + server.owner.user.username + "```", true)
                .addField(":placard: Server ID", "```" + server.id + "```", true)
                .addField(":map: Server region", "```" + server.region + "```", true)
                .addField(":busts_in_silhouette: Members", "```Total: " + server.memberCount + " | Members: " + memberCount + " | Bots: " + botCount + "```", false)
                .addField(":loud_sound: Server categories and channels", "```Category: " + categoryCount + " | Text: " + textCount + " | Voice: " + vocalCount + "```", false)
                .addField(":calendar_spiral: Server created", "```" + server.createdAt.toDateString() + " (" + moment(server.createdAt).fromNow() + ")```", true)
                .addField(":beginner: Boost level", "```Level " + server.premiumTier + " (" + server.premiumSubscriptionCount + " boost)```", true)
            message.channel.send(serverStats)
        }
        //USERINFO
        if (message.content.startsWith("!user")) {
            if (message.content == "!user" || message.content == "!userstats" || message.content == "!userinfo") {
                var utente = message.member;
            }
            else {
                var utente = message.mentions.members.first()
                if (!utente) {
                    var args = message.content.split(/\s+/);
                    var utente = message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.slice(1).join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.slice(1).join(" "))
                }
            }

            if (!utente) {
                error(message, "Utente non trovato", "`!userinfo [user]`");
                return
            }

            var elencoRuoli = "";
            utente._roles.forEach(idRuolo => elencoRuoli += `- ${message.guild.roles.cache.get(idRuolo).name}\r`);

            if (elencoRuoli == "")
                elencoRuoli = "Nessun ruolo";

            var elencoPermessi = "";
            if (utente.hasPermission("ADMINISTRATOR"))
                elencoPermessi = "👑ADMINISTRATOR";
            else {
                var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

                permissions.forEach(permesso => {
                    if (utente.hasPermission(permesso))
                        elencoPermessi += `- ${permesso}\r`;
                })
            }

            var status = utente.user.presence.status;
            switch (status) {
                case "online": status = "Online"; break;
                case "offline": status = "Offline"; break;
                case "dnd": status = "Do not disturb"; break;
                case "idle": status = "Idle"; break;
            }

            var userFlags = message.member.user.flags.toArray()
            var elencoBadge = "";
            if (!userFlags.length)
                elencoBadge = "Nessun badge"
            else {
                userFlags.forEach(badge => {
                    elencoBadge += `- ${badge}\r`;
                })
            }

            var userStats = new Discord.MessageEmbed()
                .setTitle(utente.user.tag)
                .setDescription("Tutte le statistiche su questo utente")
                .setThumbnail(utente.user.avatarURL({ dynamic: true }))
                .addField(":receipt: User ID", "```" + utente.user.id + "```", true)
                .addField(":ok_hand: Status", "```" + status + "```", true)
                .addField(":robot: Is a bot", utente.user.bot ? "```Yes```" : "```No```", true)
                .addField(":pencil: Account created", "```" + utente.user.createdAt.toDateString() + " (" + moment(utente.user.createdAt.getTime()).fromNow() + ")```", false)
                .addField(":red_car: Joined this server", "```" + new Date(utente.joinedTimestamp).toDateString() + " (" + moment(new Date(utente.joinedTimestamp).getTime()).fromNow() + ")```", false)
                .addField(":beginner: Badge", "```" + elencoBadge + "```", false)
                .addField(":shirt: Roles", "```" + elencoRuoli + "```", false)
                .addField(":muscle: Permissions", "```" + elencoPermessi + "```", false)
            message.channel.send(userStats)
        }
        //ROLEINFO
        if (message.content.startsWith("!role")) {
            var ruolo = message.mentions.roles.first()
            if (!ruolo) {
                var args = message.content.split(/\s+/);
                var ruolo = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(ruolo => ruolo.name.toLowerCase() == args.slice(1).join(" "))
            }

            if (!ruolo) {
                error(message, "Ruolo non trovato", "`!roleinfo [role]`")
                return
            }

            var memberCount = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == ruolo)).size;

            var permessiRuolo = new Permissions(ruolo.permissions.bitfield);
            var elencoPermessi = "";
            if (permessiRuolo.has("ADMINISTRATOR"))
                elencoPermessi = "👑ADMINISTRATOR";
            else {
                var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

                permissions.forEach(permesso => {
                    if (permessiRuolo.has(permesso))
                        elencoPermessi += `- ${permesso}\r`;
                })
            }

            var embed = new Discord.MessageEmbed()
                .setTitle(ruolo.name)
                .setDescription("Tutte le statistiche di questo ruolo")
                .addField(":receipt: Role ID", "```" + ruolo.id + "```", true)
                .addField(":busts_in_silhouette: Members", "```" + memberCount + "```", true)
                .addField(":rainbow: Color", "```" + ruolo.hexColor + "```", true)
                .addField(":1234: Position", "```" + ruolo.rawPosition + "```", true)
                .addField(":speech_balloon: Mentionable", ruolo.mentionable ? "```Yes```" : "```No```", true)
                .addField(":safety_pin: Separated", ruolo.hoist ? "```Yes```" : "```No```", true)
                .addField(":pencil: Role created", "```" + ruolo.createdAt.toDateString() + "```", true)
                .addField(":muscle: Permissions", "```" + elencoPermessi + "```", false)

            message.channel.send(embed)
        }
        //CHANNELINFO
        if (message.content.startsWith("!channel") || message.content.startsWith("!canale")) {
            if (message.content == "!channelinfo" || message.content == "!channelstats" || message.content == "!channel" || message.content == "!canale") {
                var canale = message.channel;
            }
            else {
                var canale = message.mentions.channels.first();
                if (!canale) {
                    var args = message.content.split(/\s+/);
                    var canale = message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(canale => canale.name.toLowerCase() == args.slice(1).join(" ")) || message.guild.channels.cache.find(canale => canale.name.slice(2).toLowerCase() == args.slice(1).join(" ")) || message.guild.channels.cache.find(canale => canale.name.slice(3).toLowerCase() == args.slice(1).join(" "))
                }
            }

            if (!canale) {
                error(message, "Canale non trovato", "`!channelinfo (canale)`")
                return
            }

            switch (canale.type) {
                case "text": canale.type = "Text"; break;
                case "voice": canale.type = "Voice"; break;
                case "news": canale.type = "News"; break;
                case "category": canale.type = "Category"; break;
            }

            if (canale.type == "Voice") {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                    .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                    .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                    .addField(":bricks: Category", canale.parent ? ("```" + canale.parent.name + "```") : "```None```", true)
                    .addField(":loud_sound: Bitrate", "```" + canale.bitrate + "```", true)
                    .addField(":bust_in_silhouette: User limit", canale.userLimit == 0 ? "```∞```" : "```" + canale.userLimit + "```", true)
                message.channel.send(embed)
                return
            }

            if (canale.type == "Category") {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questa categoria")
                    .addField(":receipt: Category ID", "```" + canale.id + "```", true)
                    .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                    .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                    .addField(":pencil: Category created", "```" + canale.createdAt.toDateString() + " (" + moment(canale.createdAt.getTime()).fromNow() + ")```", false)
                message.channel.send(embed)
                return
            }

            const hasPermissionInChannel = canale
                .permissionsFor(message.member)
                .has('VIEW_CHANNEL', true);

            var lastMessage = canale.messages.fetch(canale.lastMessageID)
                .then(lastMessage => {
                    var embed = new Discord.MessageEmbed()
                        .setTitle(canale.name)
                        .setDescription("Tutte le statistiche su questo canale")
                        .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                        .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                        .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                        .addField(":bricks: Category", canale.parent ? ("```" + canale.parent.name + "```") : "```None```", true)
                        .addField(":notepad_spiral: Topic", !canale.topic ? "```No topic```" : "```" + canale.topic + "```", true)
                        .addField(":underage: NSFW", canale.nsfw ? "```Yes```" : "```No```", true)
                        .addField(":pushpin: Last message", !hasPermissionInChannel ? "```You don't have permission to view this channel```" : ("```" + lastMessage.author.username + "#" + lastMessage.author.discriminator + " (" + moment(new Date(lastMessage.createdTimestamp).getTime()).fromNow() + ") - " + lastMessage.content + "```"), true)
                        .addField(":pencil: Channel created", "```" + canale.createdAt.toDateString() + " (" + moment(canale.createdAt.getTime()).fromNow() + ")```", false)
                    message.channel.send(embed)
                })
                .catch(() => {
                    var embed = new Discord.MessageEmbed()
                        .setTitle(canale.name)
                        .setDescription("Tutte le statistiche su questo canale")
                        .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                        .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                        .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                        .addField(":bricks: Category", canale.parent ? ("```" + canale.parent.name + "```") : "```None```", true)
                        .addField(":notepad_spiral: Topic", !canale.topic ? "```No topic```" : "```" + canale.topic + "```", true)
                        .addField(":underage: NSFW", canale.nsfw ? "```Yes```" : "```No```", true)
                        .addField(":pushpin: Last message", !hasPermissionInChannel ? "```You don't have permission to view this channel```" : "```Not found```", true)
                        .addField(":pencil: Channel created", "```" + canale.createdAt.toDateString() + " (" + moment(canale.createdAt.getTime()).fromNow() + ")```", false)
                    message.channel.send(embed)
                })
        }
        //AVATAR
        if (message.content.startsWith("!avatar")) {
            if (message.content == "!avatar") {
                var utente = message.member;
            }
            else {
                var utente = message.mentions.members.first()
                if (!utente) {
                    var args = message.content.split(/\s+/);
                    var utente = message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[1]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[1])
                }
            }

            if (!utente) {
                error(message, "Utente non trovato", "`!avatar [user]`");
                return
            }

            var embed = new Discord.MessageEmbed()
                .setTitle(utente.user.tag)
                .setDescription("L'avatar di questo utente")
                .setImage(utente.user.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                    size: 512
                }))

            message.channel.send(embed)
        }

        //CODE
        if (message.content.startsWith("!code")) {
            var comandi = {
                ban: {
                    description: "**Bannare permanentemente** un utente dal server",
                    alias: ["ban", "bannare"],
                    info: "",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=27"
                },
                tempban: {
                    description: "**Bannare temporaneamente** un utente dal server, per poi essere sbannato",
                    alias: ["tempban"],
                    info: "Prima di utilizzare questo codice è necessario installare oltre alla libreria mysql per il database (`npm i mysql`) anche quella di ms (`npm i ms`). È necessario appunto anche creare un database per segnare il tutto, in questo modo: `CREATE TABLE serverstats(tempban LONGTEXT)`",
                    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ"
                },
                tempmute: {
                    description: "**Mutare temporaneamente** un utente dal server, per poi essere smutato",
                    alias: ["tempmute"],
                    info: "Prima di utilizzare questo codice è necessario installare oltre alla libreria mysql per il database (`npm i mysql`) anche quella di ms (`npm i ms`). È necessario appunto anche creare un database per segnare il tutto, in questo modo: `CREATE TABLE serverstats(tempmute LONGTEXT)`",
                    video: "https://www.youtube.com/watch?v=E9YTtQ0U1PQ"
                },
                kick: {
                    description: "**Espellere** un utente dal server",
                    alias: ["kick", "kickare", "kikkare", "espellere"],
                    info: "",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=27"
                },
                clear: {
                    description: "**Eliminare** un tot di messaggi precedenti al comando",
                    alias: ["clear", "eliminaremessaggi", "delete", "deletemessage"],
                    info: "",
                    video: "https://youtu.be/Cr1yobtZd4c?t=389"
                },
                serverinfo: {
                    description: "Ottenere le **statistiche** del proprio server",
                    alias: ["serverinfo", "serverstats"],
                    info: "",
                    video: "https://youtu.be/FNUIyrRoitg?t=146"
                },
                userinfo: {
                    description: "Ottenere le **statistiche** di un utente",
                    alias: ["userinfo", "userstats"],
                    info: "",
                    video: "https://youtu.be/FNUIyrRoitg?t=561"
                },
                roleinfo: {
                    description: "Ottenere le **statistiche** di un ruolo",
                    alias: ["roleinfo", "rolestats"],
                    info: "",
                    video: ""
                },
                channelinfo: {
                    description: "Ottenere le **statistiche** di un canale",
                    alias: ["channelinfo", "channelstats"],
                    info: "",
                    video: ""
                },
                avatar: {
                    description: "Ottenere l'**immagine profilo** di un utente",
                    alias: ["avatar", "profilo", "immagineprofilo"],
                    info: "",
                    video: ""
                },
                say: {
                    description: "Far **scrivere** al bot un qualunque messaggio ",
                    alias: ["say"],
                    info: "",
                    video: ""
                },
                lastvideo: {
                    description: "Ottenere l'**ultimo video** uscito su un canale YouTube",
                    alias: ["lastvideo", "ultimovideo", "lastvideo youtube", "lastvideoyoutube"],
                    info: "Prima di utilizzare il comando è necessario installare la libraria yt-channel-info (`npm i yt-channel-info`)",
                    video: ""
                },
                pagine: {
                    description: "Creare un **embed** con diverse **reazioni**, che cliccandoci cambiano il contenuto del messaggio",
                    alias: ["pagine", "embedpagine", "pagineembed"],
                    info: "",
                    video: ""
                },
                random: {
                    description: "Far scrivere al bot un messaggio o un embed **randomico** tra alcuni scelti",
                    alias: ["random", "messaggiorandom", "randommessage", "randomembed"],
                    info: "",
                    video: ""
                },
                notifica: {
                    description: "Far inviare al bot un messaggio a una determinata **ora** tutti i giorni",
                    alias: ["notifica"],
                    info: "",
                    video: "https://youtu.be/SN8b92REkII?t=977"
                },
                taggare: {
                    description: "Come **taggare** utenti, ruoli, canali e categorie",
                    alias: ["taggare", "tag"],
                    info: "",
                    video: ""
                },
                ruoli: {
                    description: "Come **dare** o **rimuovere** un ruolo specifico all'utente",
                    alias: ["ruoli", "dareruolo", "rimuovereruolo"],
                    info: "",
                    video: ""
                },
                embed: {
                    description: "Come realizzare un messaggio **embed** perfetto in tutti i suoi parametri",
                    alias: ["embed"],
                    info: "Tutte le proprierà che possiamo settare a un embed sono opzionali, quindi non è necessario aggiungerle tutte ma solo quelle necessarie al vostro comando",
                    video: ""
                },
                soloruolo: {
                    description: "Far eseguire un comando/funzione solo a chi ha uno o più **ruoli**",
                    alias: ["soloruolo"],
                    info: "",
                    video: "https://youtu.be/Cr1yobtZd4c?t=14"
                },
                solopermesso: {
                    description: "Far eseguire un comando/funzione solo a chi ha uno o più **permessi**",
                    alias: ["solopermesso", "permesso"],
                    info: "Puoi trovare l'elenco di tutti i permessi [qui](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)",
                    video: ""
                },
                counting: {
                    description: "Piccolo **giochino** di counting",
                    alias: ["counting"],
                    info: "Prima di utilizzare questo codice è necessario installare oltre alla libreria mysql per il database (`npm i mysql`) anche quella di expr-eval (`npm i expr-eval`). È necessario appunto anche creare due database per segnare il tutto, in questo modo: `CREATE TABLE server (numero INT, ultimoUtente VARCHAR(50), bestScore INT)` e anche così: `CREATE TABLE user (id VARCHAR(50), username VARCHAR(50), lastScore INT, bestScore INT, correct INT, incorrect INT)`",
                    video: "https://www.youtube.com/watch?v=O-mxqZ6Sfs4"
                },
                modificare: {
                    description: "**Modificare** il contenuto di un messaggio appena inviato o inviato in passato",
                    alias: ["modificare", "editmessage", "edit"],
                    info: "",
                    video: ""
                },
                cancellare: {
                    description: "**Cancellare** il comando o il messaggio del bot",
                    alias: ["cancellare", "deletemessage", "delete"],
                    info: "",
                    video: ""
                },
                crearecanale: {
                    description: "**Creare** un canale con nome, permessi e topic",
                    alias: ["crearecanale", "createcanale", "createchannel"],
                    info: "",
                    video: ""
                },
                cancellarecanale: {
                    description: "**Cancellare** un canale",
                    alias: ["cancellarecanale", "deletecanale", "deletechannel"],
                    info: "",
                    video: ""
                },
                nomecanale: {
                    description: "**Modificare** il nome di un canale",
                    alias: ["nomecanale", "cambiarenome"],
                    info: "",
                    video: ""
                },
                ticket: {
                    description: "Sistema di **ticket**, con relativi comandi, senza database",
                    alias: ["ticket", "ticketsystem"],
                    info: "Prima di utilizzare il codice sostituire il classico `const client = new Discord.Client()` con `const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })`",
                    video: "https://www.youtube.com/watch?v=KSlehtLPIhU"
                },
                welcome: {
                    description: "Messaggio di **benvenuto** e **addio** quando un utente entra/esce dal server",
                    alias: ["welcome", "goodbye", "benvenuto", "addio"],
                    info: "Prima di usare il comando, è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione \"Bot\". Attivare le due opzioni in \"Privileged Gateway Intents\" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)",
                    video: ""
                },
                welcomeruolo: {
                    description: "Dare un **ruolo** a chi entra nel server",
                    alias: ["ruoloachientra", "welcomeruolo"],
                    info: "Prima di usare il comando, è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione \"Bot\". Attivare le due opzioni in \"Privileged Gateway Intents\" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)",
                    video: ""
                },
                membercounter: {
                    description: "Creare un **canale** con il numero di membri nel server",
                    alias: ["membercounter", "canalecounter"],
                    info: "Prima di creare il comando è necessario creare il canale dove vengono segnati i numeri di membri, potete scegliere nel creare un canale testuale o vocale. Una volta fatto copiare l'id nel codice\rInoltre è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione \"Bot\". Attivare le due opzioni in \"Privileged Gateway Intents\" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)",
                    video: ""
                },
                stato: {
                    description: "Settare lo **stato** del proprio bot (Es. Sta giocando a !help)",
                    alias: ["stato", "statobot", "status"],
                    info: "",
                    video: ""
                },
                errore1: {
                    description: "Possible EventEmitter memory leak detected. 11 message listeners added to [Client]. Use emitter.setMaxListeners() to increase limit",
                    alias: ["eventemitter", "maxlisteners", "error1", "errore1"],
                    info: "Questo errore indica che sono stati creati più di 11 client.on nel vostro codice, non è un vero è proprio errore, ma un semplice avvertimento. Per rimuoverlo definitivamente vi basta scrivere questo testo all'inizio del codice, dove si possono definire i client.on massimi",
                    video: ""
                },
                canale: {
                    description: "Ottenere un **canale testuale/vocale**",
                    alias: ["canale", "channel"],
                    info: "",
                    video: ""
                },
                utente: {
                    description: "Ottenere un **utente**",
                    alias: ["utente", "user"],
                    info: "",
                    video: ""
                }
            }
            var command = message.content.slice(5).trim().toLowerCase();
            var data, comando = "", info, video, description;

            var args = command.split(" ");
            if (args[args.length - 1].toLowerCase() == "here" && utenteMod && args.length != 1)
                command = command.slice(0, -5)

            if (utenteMod) {
                var utente = message.mentions.members.first()
                if (utente) {
                    command = command.slice(0, -22).trim()
                    if (utente.user.bot) {
                        warming(message, "Non a un Bot", "Non puoi mandare codice a un Bot")
                        return
                    }
                }
                if (!utente)
                    var utente = message.member
            }
            else
                var utente = message.member

            if (message.content == "!code") {
                var paginaInziale = new Discord.MessageEmbed()
                    .setTitle("Code")
                    .setDescription("Tutti i **codici**/**funzioni**/**tutorial** per migliorare il tuo **bot Discord**\rEcco tutte le sezioni disponibili, selezionane una, poi scegli il comando e usa `!code [codice]`")
                    .addField(":hammer: Moderazione", "Ban, Mute, Kick, Clear, ...")
                    .addField(":ferris_wheel: Comandi vari", "Serverinfo, Userinfo, Avatar, Say, ...")
                    .addField(":toolbox: Utility", "Random message, Embed, ...")
                    .addField(":rofl: Fun", "Counting, ....")
                    .addField(":file_folder: Gestione messaggi/canali", "Modificare un messaggio, Cancellare un canale, ....")
                    .addField(":wave: Welcome", "Welcome message, Ruolo a chi entra, Member counter, ....")
                    .addField(":robot: Bot", "Settare stato bot, ....")
                    .addField(":no_entry_sign: Errori comuni", "MaxListenersExceededWarning, ....")

                var paginaModerazione = new Discord.MessageEmbed()
                    .setTitle("Moderazione")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:hammer: Tutti i codici**")
                    .setColor("#DF8612")
                    .addField("**- Ban** _(#ban, #bannare)_", "Bannare permanentemente un utente dal server")
                    .addField("**- Tempban** _(#tempban)_", "Bannare temporaneamente un utente dal server, per poi essere sbannato")
                    .addField("**- Tempmute** _(#tempmute)_", "Mutare temporaneamente un utente dal server, per poi essere smutato")
                    .addField("**- Kick** _(#kick, #kickare, #kikkare, #espellere)_", "Espellere un utente dal server")
                    .addField("**- Clear** _(#clear, #eliminaremessaggi, #delete, #deletemessage)_", "Eliminare un tot di messaggi precedenti al comando")
                    .setFooter("I codici sono quelli dopo il # (ban, mute, clear, ...)")

                var paginaComandi = new Discord.MessageEmbed()
                    .setTitle("Comandi vari")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:ferris_wheel: Tutti i codici**")
                    .setColor("#5A8BB0")
                    .addField("**- Serverinfo** _(#serverinfo, #serverstats)_", "Ottenere le statistiche del proprio server")
                    .addField("**- Userinfo** _(#userinfo, #userstats)_", "Ottenere le statistiche di un utente")
                    .addField("**- Roleinfo** _(#roleinfo, #rolestats)_", "Ottenere le statistiche di un ruolo")
                    .addField("**- Channelinfo** _(#channelinfo, #channelstats)_", "Ottenere le statistiche di un canale")
                    .addField("**- Avatar** _(#avatar, #profilo, #immagineprofilo)_", "Ottenere l'immagine profilo di un utente")
                    .addField("**- Say** _(#say)_", "Far scrivere al bot un qualunche messaggio")
                    .addField("**- Lastvideo YouTube** _(#lastvideo, #ultimovideo)_", "Ottenere l'ultimo video uscito su un canale YouTube")
                    .setFooter("I codici sono quelli dopo il # (roleinfo, avatar, ...)")

                var paginaUtility = new Discord.MessageEmbed()
                    .setTitle("Utility")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:toolbox: Tutti i codici**")
                    .setColor("#D25365")
                    .addField("**- Embed a pagine** _(#pagine, #embedpagine, #pagineembed)_", "Creare un embed con diverse reazioni, che cliccandoli cambiano il contenuto del messaggio")
                    .addField("**- Messaggio/Embed random** _(#random, #messaggiorandom, #randommessage, #randomembed_", "Far scrivere al bot un messaggio o un embed randomico tra alcuni scelti")
                    .addField("**- Notifica** _(#notifica)_", "Far inviare al bot un messaggio a una determinata ora tutti i giorni")
                    .addField("**- Taggare utenti/ruoli/canali/categorie** _(#taggare, #tag)_", "Come taggare utenti, ruoli, canali e categorie")
                    .addField("**- Dare/Rimuovere ruoli** _(#ruoli, #dareruolo, #rimuovereruolo)_", "Come dare o rimuovere un ruolo specifico all'utente")
                    .addField("**- Embed** _(#embed)_", "Come realizzare un messaggio embed perfetto in tutti i suoi parametri")
                    .addField("**- Solo a chi ha un ruolo** _(#soloruolo)_", "Far eseguire un comando/funzione solo a chi ha uno o più ruoli")
                    .addField("**- Solo a chi ha un permesso** _(#solopermesso, #permesso)_", "Far eseguire un comando/funzione solo a chi ha uno o più permessi")
                    .setFooter("I codici sono quelli dopo il # (roleinfo, avatar, ...)")

                var paginaFun = new Discord.MessageEmbed()
                    .setTitle("Fun")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:rofl: Tutti i codici**")
                    .setColor("#F1C048")
                    .addField("**- Counting** _(#counting)_", "Piccolo giochino di counting")
                    .setFooter("I codici sono quelli dopo il # (counting, ...)")

                var paginaGestione = new Discord.MessageEmbed()
                    .setTitle("Gestione messaggi/canali")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:file_folder: Tutti i codici**")
                    .setColor("#53A9E9")
                    .addField("**- Modificare un messaggio** _(#modificare, #editmessage, #edit)_", "Modificare il contenuto di un messaggio appena inviato o inviato in passato")
                    .addField("**- Cancellare un messaggio** _(#cancellare, #deletemessage, #delete)_", "Cancellare il comando o il messaggio del bot")
                    .addField("**- Creare un canale** _(#crearecanale, #createcanale, #createchannel)_", "Creare un canale con nome, permessi e topic")
                    .addField("**- Cancellare un canale** _(#cancellarecanale, #deletecanale, #deletechannel)_", "Cancellare un canale")
                    .addField("**- Modificare il nome di un canale** _(#nomecanale, #cambiarenome)_", "Modificare il nome di un canale")
                    .addField("**- Sistema di ticket** _(#ticket, #ticketsystem)_", "Sistema di ticket, con relativi comandi, senza database")
                    .setFooter("I codici sono quelli dopo il # (modificare, delete, cambianome, ...)")

                var paginaWelcome = new Discord.MessageEmbed()
                    .setTitle("Welcome")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:wave: Tutti i codici**")
                    .setColor("#F9CD58")
                    .addField("**- Welcome/Goodbye message** _(#welcome, #goodbye, #benvenuto, #addio)_", "Messaggio di benvenuto e addio quando un utente entra/esce dal server")
                    .addField("**- Ruolo a chi entra** _(#ruoloachientra, #welcomeruolo)_", "Dare un ruolo a chi entra nel server")
                    .addField("**- Member counter** _(#membercouter, #canalecounter)_", "Creare un canale con il numero di membri nel server")
                    .setFooter("I codici sono quelli dopo il # (welcome, membercounter, ...)")

                var paginaBot = new Discord.MessageEmbed()
                    .setTitle("Bot")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:robot: Tutti i codici**")
                    .setColor("#3E80B4")
                    .addField("**- Stato bot** _(#stato, #statobot, #status, #statusbot)_", "Settare lo stato del proprio bot (Es. Sta giocando a !help)")
                    .setFooter("I codici sono quelli dopo il # (stato, ...)")

                var paginaErrori = new Discord.MessageEmbed()
                    .setTitle("Errori comuni")
                    .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il comando `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\r\r**:no_entry_sign: Tutti i codici**")
                    .setColor("#BB2F41")
                    .addField("**- MaxListenersExceededWarning** _(#eventemitter, #maxlisteners, #error1, #errore1)_", "Possible EventEmitter memory leak detected. 11 message listeners added to [Client]. Use emitter.setMaxListeners() to increase limit")
                    .setFooter("I codici sono quelli dopo il # (errore1, ...)")

                message.channel.send(paginaInziale).then(msg => {
                    message.delete({ timeout: 120000 })
                    msg.delete({ timeout: 120000 })
                    msg.react('🔨').then(r => {
                        msg.react('🎡')
                        msg.react('🧰')
                        msg.react('🤣')
                        msg.react('📁')
                        msg.react('👋')
                        msg.react('🤖')
                        msg.react('🚫')

                        // Filters
                        const reactModerazione = (reaction, user) => reaction.emoji.name === '🔨' && user.id === message.author.id
                        const reactComandi = (reaction, user) => reaction.emoji.name === '🎡' && user.id === message.author.id
                        const reactUtility = (reaction, user) => reaction.emoji.name === '🧰' && user.id === message.author.id
                        const reactFun = (reaction, user) => reaction.emoji.name === '🤣' && user.id === message.author.id
                        const reactGestione = (reaction, user) => reaction.emoji.name === '📁' && user.id === message.author.id
                        const reactWelcome = (reaction, user) => reaction.emoji.name === '👋' && user.id === message.author.id
                        const reactBot = (reaction, user) => reaction.emoji.name === '🤖' && user.id === message.author.id
                        const reactErrori = (reaction, user) => reaction.emoji.name === '🚫' && user.id === message.author.id

                        const paginaMod = msg.createReactionCollector(reactModerazione)
                        const paginaCom = msg.createReactionCollector(reactComandi)
                        const paginaUti = msg.createReactionCollector(reactUtility)
                        const paginaFunny = msg.createReactionCollector(reactFun)
                        const paginaGest = msg.createReactionCollector(reactGestione)
                        const paginaWelc = msg.createReactionCollector(reactWelcome)
                        const paginaBott = msg.createReactionCollector(reactBot)
                        const paginaErr = msg.createReactionCollector(reactErrori)

                        paginaMod.on('collect', (r, u) => {
                            msg.edit(paginaModerazione)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaCom.on('collect', (r, u) => {
                            msg.edit(paginaComandi)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaUti.on('collect', (r, u) => {
                            msg.edit(paginaUtility)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaFunny.on('collect', (r, u) => {
                            msg.edit(paginaFun)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaGest.on('collect', (r, u) => {
                            msg.edit(paginaGestione)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaWelc.on('collect', (r, u) => {
                            msg.edit(paginaWelcome)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaBott.on('collect', (r, u) => {
                            msg.edit(paginaBot)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaErr.on('collect', (r, u) => {
                            msg.edit(paginaErrori)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                    })
                })
                return
            }

            for (var i = 0; i < Object.keys(comandi).length; i++) {
                comandi[Object.keys(comandi)[i]].alias.forEach(alias => {
                    if (alias == command) {
                        comando = Object.keys(comandi)[i];
                        info = comandi[Object.keys(comandi)[i]].info;
                        video = comandi[Object.keys(comandi)[i]].video;
                        description = comandi[Object.keys(comandi)[i]].video;
                    }
                })
            }

            if (!comando) {
                error(message, "Codice non trovato", "`!code(codice)`")
                return
            }
            else {
                data = getCode(comando)

                var embed = new Discord.MessageEmbed()
                    .setTitle(comando.toUpperCase())

                if (video)
                    embed.setDescription(description + "\rGuarda il video su YouTube per maggiori info ([Clicca qui](" + video + "))");
                else
                    embed.setDescription(description)

                if (info)
                    embed.addField(":name_badge: Info - Leggere attentamente", info)

                if (data.length > 1000) {
                    data = data.slice(0, 950);

                    embed
                        .addField(":wrench: Code:", "```js\r" + data + "```")
                        .addField(":warning: Il codice è troppo lungo", "Per ricevere il codice completo puoi scaricare il file allegato")

                    if (args[args.length - 1].toLowerCase() == "here") {
                        message.channel.send(embed)
                        message.channel.send({ files: ["comandi/" + comando + "-GiulioAndCode.txt"] })
                    }
                    else {
                        utente.send(embed).catch(() => {
                            warming(message, "DM non concessi", "Questo utente non può ricevere messaggi privati")
                            return
                        }).then(() => {
                            utente.send({ files: ["comandi/" + comando + "-GiulioAndCode.txt"] })
                            correct(message, "Ecco il codice", "Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())
                        })
                    }
                }
                else {
                    embed.addField(":wrench: Code:", "```js\r" + data + "```");
                    if (args[args.length - 1].toLowerCase() == "here")
                        message.channel.send(embed)
                    else {
                        utente.send(embed).catch(() => {
                            warming(message, "DM non concessi", "Questo utente non può ricevere messaggi privati")
                            return
                        }).then(() => {
                            correct(message, "Ecco il codice", "Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())
                        })
                    }
                }
            }
        }

        //SUGGESTIONS
        if (message.content.startsWith("!suggest") || message.content.startsWith("!suggerisci") || message.content.startsWith("!suggerimento")) {
            if (message.content.startsWith("!suggest"))
                var contenuto = message.content.slice(9).trim();
            if (message.content.startsWith("!suggerisci"))
                var contenuto = message.content.slice(12).trim();
            if (message.content.startsWith("!suggerimento"))
                var contenuto = message.content.slice(14).trim();

            if (contenuto == "") {
                error(message, "Inserire un suggerimento", "`!suggest [suggerimento]`")
                return
            }

            contenuto = contenuto.replace(/{/g, "")
            contenuto = contenuto.replace(/}/g, "")
            contenuto = contenuto.replace(/'/g, "")
            contenuto = contenuto.replace(/"/g, "")
            contenuto = contenuto.replace(/`/g, "")
            contenuto = contenuto.replace(/\n/g, " ")

            embedSuggestion
                .setTitle("💡Suggestions by " + message.member.user.username)
                .setDescription(contenuto)
                .setThumbnail(message.member.user.avatarURL({ dynamic: true }))

            var canale = client.channels.cache.find(channel => channel.id == config.idCanaliServer.suggestions);

            canale.send(embedSuggestion)
                .then(msg => {
                    msg.react("😍")
                    msg.react("💩")
                    var messageId = msg.id;

                    embedSuggestion
                        .setFooter("Suggestion ID: " + messageId)

                    msg.edit(embedSuggestion)

                    suggestions[messageId] = {
                        suggerimento: contenuto,
                        user: message.member.user.id,
                        messageId: messageId,
                        totVotiPos: [],
                        totVotiNeg: []
                    }

                })
            message.delete();
        }
        if (message.content.startsWith("!sdelete")) {
            if (!utenteMod) {
                permesso(message, "!sdelete")
                return
            }

            var id = message.content.slice(9).trim();
            if (id == "") {
                error(message, "Inserire un id", "`!sdelete [id]`")
                return
            }

            if (!suggestions[id]) {
                error(message, "Suggerimento non trovato", "`!sdelete [id]`")
                return
            }
            delete suggestions[id];

            var canale = client.channels.cache.get(config.idCanaliServer.suggestions)
            canale.messages.fetch(id)
                .then(message => {
                    message.delete()
                })

            correct(message, "Suggerimento eliminato", "Suggestion ID: " + id + " eliminato dalla lista")
        }

        //CHALLENGE
        if (message.content.startsWith("!challenge") || message.content.startsWith("!sfida")) {
            if (message.content.startsWith("!challenge"))
                var contenuto = message.content.slice(11).trim();
            if (message.content.startsWith("!sfida"))
                var contenuto = message.content.slice(7).trim();

            if (contenuto == "") {
                error(message, "Inserire una challenge", "`!challenge [sfida]`")
                return
            }

            contenuto = contenuto.replace(/{/g, "")
            contenuto = contenuto.replace(/}/g, "")
            contenuto = contenuto.replace(/'/g, "")
            contenuto = contenuto.replace(/"/g, "")
            contenuto = contenuto.replace(/`/g, "")
            contenuto = contenuto.replace(/\n/g, " ")

            embedChallenge
                .setTitle("🎯 Challenge by " + message.member.user.username)
                .setDescription(contenuto)
                .setThumbnail(message.member.user.avatarURL({ dynamic: true }))

            var canale = client.channels.cache.find(channel => channel.id == config.idCanaliServer.challenges);

            canale.send(embedChallenge)
                .then(msg => {
                    msg.react("👍")
                    msg.react("👎")
                    var messageId = msg.id;

                    embedChallenge
                        .setFooter("Challenge ID: " + messageId)

                    msg.edit(embedChallenge)

                    challenges[messageId] = {
                        sfida: contenuto,
                        user: message.member.user.id,
                        messageId: messageId,
                        totVotiPos: [],
                        totVotiNeg: []
                    }
                })
            message.delete();
        }
        if (message.content.startsWith("!cdelete")) {
            if (!utenteMod) {
                permesso(message, "!cdelete")
                return
            }

            var id = message.content.slice(9).trim();
            if (id == "") {
                error(message, "Inserire un id", "`!cdelete [id]`")
                return
            }

            if (!challenges[id]) {
                error(message, "Challenge non trovata", "`!cdelete [id]`")
                return
            }
            delete challenges[id];

            var canale = client.channels.cache.get(config.idCanaliServer.challenges)
            canale.messages.fetch(id)
                .then(message => {
                    message.delete()
                })

            correct(message, "Challenge eliminata", "Challenge ID: " + id + " eliminata dalla lista")
        }

        //NOTIFICATION
        if (message.content == "!config" || message.content == "!notifiche" || message.content == "!notification" || message.content == "!notifications") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Notification - " + message.member.user.tag)
                .setDescription("Impostare le notifiche da ricevere all'interno del server")
                .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                .addField(message.member.roles.cache.has("826776846749925376") ? "🟣 Twitch - :green_circle: ON" : "🟣 Twitch - :red_circle: OFF", "Notifiche sulle dirette, cosa si farà in live, o eventi")

            message.channel.send(embed)
                .then((msg) => {
                    msg.delete({ timeout: 120000 })
                    msg.react("📋")
                    msg.react("📰")
                    msg.react("📝")
                    msg.react("🟣")
                    message.delete({ timeout: 120000 })

                    // Filters
                    const reactAnnouncements = (reaction, user) => reaction.emoji.name === '📋'
                    const reactNews = (reaction, user) => reaction.emoji.name === '📰'
                    const reactTwitch = (reaction, user) => reaction.emoji.name === '🟣'
                    const reactChangelog = (reaction, user) => reaction.emoji.name === '📝'

                    const paginaAnnouncements = msg.createReactionCollector(reactAnnouncements)
                    const paginaNews = msg.createReactionCollector(reactNews)
                    const paginaTwitch = msg.createReactionCollector(reactTwitch)
                    const paginaChangelog = msg.createReactionCollector(reactChangelog)

                    paginaAnnouncements.on('collect', (r, u) => {
                        if (u.bot)
                            return
                        r.users.remove(r.users.cache.filter(u => u.bot == false).first())
                        if (u.id == message.author.id) {

                            var embed = new Discord.MessageEmbed()
                                .setTitle("Notification - " + message.member.user.tag)
                                .setDescription("Impostare le notifiche da ricevere all'interno del server")
                                .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")

                            if (!message.member.roles.cache.has("815649916574629941")) {
                                message.member.roles.add("815649916574629941")
                                embed
                                    .addField("📋 Announcements - :green_circle: ON", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            }
                            else {
                                message.member.roles.remove("815649916574629941")
                                embed
                                    .addField("📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                            }
                            embed
                                .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                                .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                                .addField(message.member.roles.cache.has("826776846749925376") ? "🟣 Twitch - :green_circle: ON" : "🟣 Twitch - :red_circle: OFF", "Notifiche sulle dirette, cosa si farà in live, o eventi")
                            msg.edit(embed)
                        }
                    })
                    paginaNews.on('collect', (r, u) => {
                        if (u.bot)
                            return
                        r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                        if (u.id == message.author.id) {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Notification - " + message.member.user.tag)
                                .setDescription("Impostare le notifiche da ricevere all'interno del server")
                                .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                                .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")

                            if (!message.member.roles.cache.has("815649625591382077")) {
                                message.member.roles.add("815649625591382077")
                                embed
                                    .addField("📰 News - :green_circle: ON", "Notifiche su annunci un po' meno importanti")
                            }
                            else {
                                message.member.roles.remove("815649625591382077")
                                embed
                                    .addField("📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            }
                            embed
                                .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                                .addField(message.member.roles.cache.has("826776846749925376") ? "🟣 Twitch - :green_circle: ON" : "🟣 Twitch - :red_circle: OFF", "Notifiche sulle dirette, cosa si farà in live, o eventi")
                            msg.edit(embed)
                        }
                    })
                    paginaTwitch.on('collect', (r, u) => {
                        if (u.bot)
                            return
                        r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                        if (u.id == message.author.id) {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Notification - " + message.member.user.tag)
                                .setDescription("Impostare le notifiche da ricevere all'interno del server")
                                .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                                .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                                .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                                .addField(message.member.roles.cache.has("826784690487951370") ? "📝 Changelog - :green_circle: ON" : "📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")

                            if (!message.member.roles.cache.has("826776846749925376")) {
                                message.member.roles.add("826776846749925376")
                                embed
                                    .addField("🟣 Twitch - :green_circle: ON", "Notifiche sulle dirette, cosa si farà in live, o eventi")
                            }
                            else {
                                message.member.roles.remove("826776846749925376")
                                embed
                                    .addField("🟣 Twitch - :red_circle: OFF", "Notifiche sulle dirette, cosa si farà in live, o eventi")
                            }
                            msg.edit(embed)
                        }
                    })
                    paginaChangelog.on('collect', (r, u) => {
                        if (u.bot)
                            return
                        r.users.remove(r.users.cache.filter(u => u.bot == false).first())

                        if (u.id == message.author.id) {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Notification - " + message.member.user.tag)
                                .setDescription("Impostare le notifiche da ricevere all'interno del server")
                                .setThumbnail("https://i.postimg.cc/cLQ8kP4d/bell.png")
                                .addField(message.member.roles.cache.has("815649916574629941") ? "📋 Announcements - :green_circle: ON" : "📋 Announcements - :red_circle: OFF", "Notifiche sugli annuncio o notizie importanti sul canale/server")
                                .addField(message.member.roles.cache.has("815649625591382077") ? "📰 News - :green_circle: ON" : "📰 News - :red_circle: OFF", "Notifiche su annunci un po' meno importanti")
                            if (!message.member.roles.cache.has("826784690487951370")) {
                                message.member.roles.add("826784690487951370")
                                embed
                                    .addField("📝 Changelog - :green_circle: ON", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            }
                            else {
                                message.member.roles.remove("826784690487951370")
                                embed
                                    .addField("📝 Changelog - :red_circle: OFF", "Notifiche sulle nuove aggiunte e bug risolti dei bot ufficiali")
                            }
                            embed
                                .addField(message.member.roles.cache.has("826776846749925376") ? "🟣 Twitch - :green_circle: ON" : "🟣 Twitch - :red_circle: OFF", "Notifiche sulle dirette, cosa si farà in live, o eventi")
                            msg.edit(embed)
                        }
                    })
                })
        }

        //INVITE LINK
        if (message.content == "!invite") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Invito del server")
                .setDescription(":man_tipping_hand: Ecco a te l'invito da poter condividere con chiunque tu voglia per entrare nel server\r\rhttps://discord.gg/38bqm5UvUB")
                .setColor("#677BC4");

            message.channel.send(embed)
        }

        //TICKET
        if (message.content == "!tclose") {
            var topic = message.channel.topic;
            if (!topic) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tclose` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }

            if (topic.startsWith("Muted") || topic.startsWith("Tempmuted") || topic.startsWith("Banned") || topic.startsWith("Tempbanned")) return

            if (!topic.startsWith("User ID")) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tclose` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }
            if (topic.startsWith("Muted") || topic.startsWith("Tempmuted") || topic.startsWith("Banned") || topic.startsWith("Tempbanned") || topic.startsWith("User ID")) {
                var idUtente;
                if (topic.startsWith("Muted"))
                    idUtente = topic.slice(5 + 10)
                if (topic.startsWith("Tempmuted"))
                    idUtente = topic.slice(9 + 10)
                if (topic.startsWith("Banned"))
                    idUtente = topic.slice(6 + 10)
                if (topic.startsWith("Tempbanned"))
                    idUtente = topic.slice(10 + 10)
                if (topic.startsWith("User ID"))
                    idUtente = topic.slice(9)

                if (utenteMod || message.author.id == idUtente) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Ticket in eliminazione")
                        .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                        .setColor("#16A0F4")
                        .setDescription("Questo ticket si sta per cancellare")

                    message.channel.send(embed);

                    setTimeout(function () {
                        message.channel.delete()
                    }, 10000)
                }
                else {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Non hai il permesso")
                        .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                        .setColor("#9E005D")
                        .setDescription("Non puoi eseguire il comando `!tclose` in questo canale")

                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 10000 })
                        msg.delete({ timeout: 10000 })
                    })
                }

            }
        }
        if (message.content.startsWith("!tadd")) {
            var topic = message.channel.topic;
            if (!topic) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tadd` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }

            if (topic.startsWith("Muted") || topic.startsWith("Tempmuted") || topic.startsWith("Banned") || topic.startsWith("Tempbanned")) return

            if (!topic.startsWith("User ID")) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tadd` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }
            if (topic.startsWith("User ID")) {
                idUtente = topic.slice(9)
                if (utenteMod || message.author.id == idUtente) {
                    var utente = message.mentions.members.first()
                    if (!utente) {
                        var args = message.content.split(/\s+/);
                        var utente = message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[1]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[1])
                    }

                    if (!utente) {
                        error(message, "Utente non trovato", "`!tadd [user]`")
                        return
                    }

                    const hasPermissionInChannel = message.channel
                        .permissionsFor(utente)
                        .has('VIEW_CHANNEL', true);

                    if (hasPermissionInChannel) {
                        warming(message, "Questo utente è già presente", "Questo utente ha già accesso a questo ticket")
                        return
                    }

                    message.channel.updateOverwrite(utente, {
                        VIEW_CHANNEL: true
                    })

                    correct(message, "Utente aggiunto", `${utente.toString()} è stato aggiunto a questo ticket`)
                }
                else {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Non hai il permesso")
                        .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                        .setColor("#9E005D")
                        .setDescription("Non puoi eseguire il comando `!tclose` in questo canale")

                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 10000 })
                        msg.delete({ timeout: 10000 })
                    })
                    return
                }
            }
        }
        if (message.content.startsWith("!tremove")) {
            var topic = message.channel.topic;
            if (!topic) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tremove` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }

            if (topic.startsWith("Muted") || topic.startsWith("Tempmuted") || topic.startsWith("Banned") || topic.startsWith("Tempbanned")) return

            if (!topic.startsWith("User ID")) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `!tremove` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 10000 })
                    msg.delete({ timeout: 10000 })
                })
                return
            }
            if (topic.startsWith("User ID")) {
                idUtente = topic.slice(9)

                if (utenteMod || message.author.id == idUtente) {
                    var utente = message.mentions.members.first()
                    if (!utente) {
                        var args = message.content.split(/\s+/);
                        var utente = message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[1]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[1])
                    }

                    if (!utente) {
                        var embed = new Discord.MessageEmbed()
                        error(message, "Utente non trovato", "`!tremove [user]`")
                        return
                    }

                    const hasPermissionInChannel = message.channel
                        .permissionsFor(utente)
                        .has('VIEW_CHANNEL', true);

                    if (!hasPermissionInChannel) {
                        warming(message, "Questo utente è già rimosso", "Questo utente non ha già accesso a questo ticket")
                        return
                    }

                    var userMod = false;
                    config.ruoliMod.forEach(ruolo => {
                        if (utente.roles.cache.has(ruolo)) userMod = true;
                    })

                    if (userMod) {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Non hai il permesso")
                            .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                            .setColor("#9E005D")
                            .setDescription("Non puoi rimove questo utente dal ticket")

                        message.channel.send(embed).then(msg => {
                            message.delete({ timeout: 7000 })
                            msg.delete({ timeout: 7000 })
                        })
                        return
                    }

                    message.channel.updateOverwrite(utente, {
                        VIEW_CHANNEL: false
                    })

                    correct(message, "Utente rimosso", `${utente.toString()} è stato rimosso a questo ticket`)
                }
                else {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Non hai il permesso")
                        .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                        .setColor("#9E005D")
                        .setDescription("Non puoi eseguire il comando `!tremove` in questo canale")

                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 7000 })
                        msg.delete({ timeout: 7000 })
                    })
                    return
                }
            }
        }

        //LOCKDOWN
        if (message.content == "!lockdown") {
            if (!utenteMod) {
                permesso(message, "Non hai il permesso", "Non puoi eseguire il comando `!lockdown` perchè non hai il permesso")
                return
            }

            let ruolo = message.guild.roles.cache.find(r => r.name === "@everyone");
            if (!lockdown) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("LOCKDOWN ATTIVATO")
                    .setColor("#ED1C24")
                    .setDescription("È appena stato attivato il **sistema di lockdown**\n\nTutti gli utenti con livello inferiore a 5 non vedranno piu nessun canale fino alla disattivazione di questo sistema")
                message.channel.send(embed)
                lockdown = true;
                ruolo.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "USE_VAD"])

                var canale = client.channels.cache.get("838673639594655794");
                canale.updateOverwrite(ruolo, {
                    VIEW_CHANNEL: true,
                })
                var canale = client.channels.cache.get("793781898689773589");
                canale.send(embed);
            }
            else {
                var embed = new Discord.MessageEmbed()
                    .setTitle("LOCKDOWN DISATTIVATO")
                    .setColor("#77B155")
                    .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti con livello inferiore a 5 possono continuare a partecipare nel server")
                message.channel.send(embed)
                ruolo.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD"])
                lockdown = false;
                var canale = client.channels.cache.get("838673639594655794");
                canale.updateOverwrite(ruolo, {
                    VIEW_CHANNEL: false,
                })
                var canale = client.channels.cache.get("793781898689773589");
                canale.send(embed);
            }

        }

        //SAY
        if (message.content.startsWith("!say")) {
            var args = message.content.split(/\s+/);
            var testo;
            testo = args.slice(1).join(" ");
            if (!testo) {
                error(message, "Inserire un testo", "`!say [text]`")
                return
            }

            if (message.content.includes(`@everyone`) || message.content.includes(`@here`) || message.mentions.roles.first()) {
                warming(message, "Non pingare i ruoli", "Scrivi un messaggio senza taggare nessun ruolo del server")
                return
            }

            if (!utenteMod && !message.member.roles.cache.has("799990705216159791") && !message.member.roles.cache.has("799990735839559690") && !message.member.roles.cache.has("799990773708750878") && !message.member.roles.cache.has("799990806357213194") && !message.member.roles.cache.has("799990832224272405") && !message.member.roles.cache.has("799990865001971722") && !message.member.roles.cache.has("799990896849977344") && !message.member.roles.cache.has("800740423999815710") && !message.member.roles.cache.has("800740473437945927") && !message.member.roles.cache.has("800740873351462932") && !message.member.roles.cache.has("800009879371644940")) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il livello")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#ff653f")
                    .setDescription("Puoi utilizzare il comando `!say` solo dal livello 10")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            message.delete()
            message.channel.send(testo)
        }

    } catch (err) {
        codeError(err);
    }
})


client.on("guildMemberAdd", member => {
    try {
        if (member.user.bot) return
        if (member.guild.id != config.idGiulioAndCommunity) return

        //WELCOME MESSAGE
        var server = client.guilds.cache.get(config.idGiulioAndCommunity);
        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var utentiCount = server.memberCount - botCount;

        var emoji = {
            emoji1: "🤙",
            emoji2: "👀",
            emoji3: "📜",
            emoji4: "🚨",
            emoji5: "📋",
            emoji6: "📰",
            emoji7: "📝",
            emoji8: "🟣"
        }
        var canale = client.channels.cache.get(config.idCanaliServer.welcome)
        canale.send(`
-------------- 𝐍𝐔𝐎𝐕𝐎 𝐌𝐄𝐌𝐁𝐑𝐎 --------------
:call_me: Ciao ${member.toString()}, benvenuto in GiulioAndCommunity
:eyes: Sei il **${utentiCount}° Membro**
:scroll: Prima di fare altro, leggi le <#793781895829258260>
:rotating_light: Puoi vedere tutte le informazioni sul server in <#793781897619570738>`)

        //RIMETTERE RUOLI
        var elencoRuoli = "";
        var index = userstatsList.findIndex(x => x.id == member.id);
        if (index > 0) {
            var ruoli = JSON.parse(userstatsList[index].roles);
            userstatsList[index].roles = "[]";
            for (var i = 0; i < ruoli.length; i++) {
                elencoRuoli += `${member.guild.roles.cache.get(ruoli[i]).name}\r`;
                member.roles.add(ruoli[i]).catch()
            }
        }

        var embed = new Discord.MessageEmbed()
            .setAuthor(`[WELCOME] ${member.user.username}#${member.user.discriminator}`, member.user.avatarURL())
            .setThumbnail("https://i.postimg.cc/J73zF2Wj/Welcome.png")
            .setColor("#7AC943")
            .addField("Account created", moment(member.user.createdAt).fromNow())
            .setFooter(`User ID: ${member.id}`)

        if (elencoRuoli != "")
            embed.addField("Old roles", elencoRuoli)

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed);

        //PRIVATE WELCOME
        var testo = `
-------------\\${emoji.emoji1} **BENVENUTO IN GIULIOANDCOMMUNITY** \\${emoji.emoji1}-------------
Ciao <@${member.id}> benvenuto nel server di GiulioAndCode
In questo server potrai stare e parlare con tutta la community di Giulio, spero tu ti possa divertire

Prima di iniziare ti consiglio di leggere tutte le regole del server in <#793781895829258260> e tutte le info sui bot, canali, ruoli in <#793781897619570738>
`
        if (elencoRuoli != "") {
            testo += `
Eri gia entrato in precendenza nel server, ecco di nuovo i tuoi **vecchi ruoli**
${elencoRuoli}
`
        }
        else {
            member.roles.add("815649916574629941")
            member.roles.add("815649625591382077")
            member.roles.add("826776846749925376")
            member.roles.add("826784690487951370")
            testo += `
In questo server c'è un sistema di **notifiche** diviso in categorie:
\\${emoji.emoji5} Announcements - Notifiche di annunci importanti sul server/canale/bot
\\${emoji.emoji6} News - Notifiche di notizie un po' meno importanti
\\${emoji.emoji7} Changelog - Notifiche di changelog delle modifiche mensili su bot/server
\\${emoji.emoji8} Twitch - Notifiche di format in live su Twitch

Di default ogni utente ha tutte e quattro le notifiche attive, ma se fai \`!config\` nel server potrai decidere quali attivare e disattivare
Buon divertimento!`
        }

        member.send(testo)

    } catch (err) {
        codeError(err);
    }
})
client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    if (member.guild.id != config.idGiulioAndCommunity) return

    try {

        var index = userstatsList.findIndex(x => x.id == member.id);
        if (index < 0) {
            if (member._roles.length > 0) {

                var index = userstatsList.length;
                userstatsList[index] = {
                    id: member.id,
                    username: `${member.user.username}#${member.user.discriminator}`,
                    roles: JSON.stringify(member._roles)
                }
                addUserToDatabase(userstatsList[index])
            }
        }
        else {
            userstatsList[index].roles = JSON.stringify(member._roles)
        }
        var elencoRuoli = "";
        for (var i = 0; i < member._roles.length; i++) {
            elencoRuoli += `<@&${member._roles[i]}>\r`;
        }
        var embed = new Discord.MessageEmbed()
            .setAuthor(`[GOODBYE] ${member.user.username}#${member.user.discriminator}`, member.user.avatarURL())
            .addField("Time on server", moment(new Date().getTime()).from(moment(member.joinedTimestamp), true))
            .setThumbnail("https://i.postimg.cc/qqGBCzG1/Goodbye.png")
            .setColor("#FC1D24")
            .setFooter(`User ID: ${member.id}`)

        if (elencoRuoli != "")
            embed.addField("Roles", elencoRuoli)

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed);

    } catch (err) {
        codeError(err);
    }
})

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    try {

        if (messageReaction.message.channel.id == config.idCanaliServer.suggestions) {
            if (!suggestions.hasOwnProperty(messageReaction.message.id)) return

            if (messageReaction._emoji.name == "😍") {
                if (!suggestions[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                    suggestions[messageReaction.message.id].totVotiPos.push(user.id)
                }
                else {
                    messageReaction.users.remove(user);
                }
            }

            else if (messageReaction._emoji.name == "💩") {

                if (!suggestions[messageReaction.message.id].totVotiPos.includes(user.id)) {
                    suggestions[messageReaction.message.id].totVotiNeg.push(user.id)
                }
                else {
                    messageReaction.users.remove(user);
                }

            }
            var canale = client.channels.cache.get(config.idCanaliServer.suggestions)
            canale.messages.fetch(messageReaction.message.id)
                .then(message => {

                    var votiPos = suggestions[messageReaction.message.id].totVotiPos.length
                    var votiNeg = suggestions[messageReaction.message.id].totVotiNeg.length

                    var opinion = votiPos - votiNeg

                    const newEmbed = new Discord.MessageEmbed()
                        .setTitle("💡Suggestions by " + client.users.cache.get(suggestions[messageReaction.message.id].user).username)
                        .setDescription(suggestions[messageReaction.message.id].suggerimento)
                        .setThumbnail(client.users.cache.get(suggestions[messageReaction.message.id].user).avatarURL({ dynamic: true }))
                        .setFooter("Suggestion ID: " + messageReaction.message.id)

                    if (votiPos == 0 && votiNeg == 0) {

                    }
                    else {
                        var upvotes = 100 * votiPos / (votiPos + votiNeg)
                        if (upvotes % 1 != 0) {
                            upvotes = upvotes.toFixed(2)

                        }
                        var downvotes = 100 * votiNeg / (votiPos + votiNeg)
                        if (downvotes % 1 != 0) {
                            downvotes = downvotes.toFixed(2)
                        }
                        newEmbed
                            .addField("🥇Votes", "Opinion: " + (opinion > 0 ? "+" + opinion : opinion) + "\rUpvotes: " + votiPos + " - " + upvotes + "%\rDownvotes: " + votiNeg + " - " + downvotes + "%")
                    }

                    message.edit(newEmbed)
                })
        }
        if (messageReaction.message.channel.id == config.idCanaliServer.challenges) {
            if (!challenges.hasOwnProperty(messageReaction.message.id)) return

            if (messageReaction._emoji.name == "👍") {
                if (!challenges[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                    challenges[messageReaction.message.id].totVotiPos.push(user.id)

                }
                else {
                    messageReaction.users.remove(user);
                }

            }
            else if (messageReaction._emoji.name == "👎") {

                if (!challenges[messageReaction.message.id].totVotiPos.includes(user.id)) {
                    challenges[messageReaction.message.id].totVotiNeg.push(user.id)

                }
                else {
                    messageReaction.users.remove(user);
                }

            }

            var canale = client.channels.cache.get(config.idCanaliServer.challenges)
            canale.messages.fetch(messageReaction.message.id)
                .then(message => {
                    var votiPos = challenges[messageReaction.message.id].totVotiPos.length
                    var votiNeg = challenges[messageReaction.message.id].totVotiNeg.length

                    var opinion = votiPos - votiNeg

                    const newEmbed = new Discord.MessageEmbed()
                        .setTitle("🎯 Challenge by " + client.users.cache.get(challenges[messageReaction.message.id].user).username)
                        .setDescription(challenges[messageReaction.message.id].sfida)
                        .setThumbnail(client.users.cache.get(challenges[messageReaction.message.id].user).avatarURL({ dynamic: true }))
                        .setFooter("Challenge ID: " + messageReaction.message.id)

                    if (votiPos == 0 && votiNeg == 0) {

                    }
                    else {
                        var upvotes = 100 * votiPos / (votiPos + votiNeg)
                        if (upvotes % 1 != 0) {
                            upvotes = upvotes.toFixed(2)

                        }
                        var downvotes = 100 * votiNeg / (votiPos + votiNeg)
                        if (downvotes % 1 != 0) {
                            downvotes = downvotes.toFixed(2)
                        }
                        newEmbed
                            .addField("🥇Votes", "Opinion: " + (opinion > 0 ? "+" + opinion : opinion) + "\rUpvotes: " + votiPos + " - " + upvotes + "%\rDownvotes: " + votiNeg + " - " + downvotes + "%")
                    }

                    message.edit(newEmbed)
                })
        }

        if (messageReaction._emoji.name == "📩") {
            var server = client.guilds.cache.get(config.idGiulioAndCommunity);
            if (messageReaction.message.channel.id == config.idCanaliServer.staffHelp) {
                messageReaction.users.remove(user);
                if (server.channels.cache.find(channel => channel.topic == `User ID: ${user.id}` && channel.parentID == "835059084532776970")) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Ticket già aperto")
                        .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                        .setColor("#8F8F8F")
                        .setDescription("Puoi aprire un solo ticket di supporto alla volta")

                    user.send(embed).catch();
                    return
                }
                server.channels.create(`${user.username}`, {
                    type: "text",

                }).then((canale) => {
                    canale.setTopic(`User ID: ${user.id}`);
                    canale.setParent("835059084532776970");
                    canale.overwritePermissions([
                        {
                            id: server.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: user.id,
                            allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                        },
                    ]);
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Ticket aperto")
                        .setColor("#4b9afa")
                        .setDescription("In questa chat potrai richiedere supporto privato allo staff")

                    canale.send(embed)
                    var testo = `<@${user.id}> ha aperto un ticket\r`;
                    config.ruoliMod.forEach(ruolo => {
                        testo += `<@&${ruolo}> `;
                    })
                    canale.send(testo)
                        .then(msg => {
                            msg.delete({ timeout: 1000 });
                        })
                })
            }
        }

    } catch (err) {
        codeError(err)
    }
})
client.on("messageReactionRemove", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    try {

        if (messageReaction.message.channel.id == config.idCanaliServer.suggestions) {
            if (!suggestions.hasOwnProperty(messageReaction.message.id)) return
            if (messageReaction._emoji.name == "😍") {


                if (suggestions[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id) < 0) {
                    suggestions[messageReaction.message.id].totVotiPos.splice(suggestions[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id), 1)
                }


            }
            else if (messageReaction._emoji.name == "💩") {
                if (suggestions[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id) < 0) {
                    suggestions[messageReaction.message.id].totVotiNeg.splice(suggestions[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id), 1)
                }

            }


            var canale = client.channels.cache.get(config.idCanaliServer.suggestions)
            canale.messages.fetch(messageReaction.message.id)
                .then(message => {

                    var votiPos = suggestions[messageReaction.message.id].totVotiPos.length
                    var votiNeg = suggestions[messageReaction.message.id].totVotiNeg.length

                    var opinion = votiPos - votiNeg

                    const newEmbed = new Discord.MessageEmbed()
                        .setTitle("💡Suggestions by " + client.users.cache.get(suggestions[messageReaction.message.id].user).username)
                        .setDescription(suggestions[messageReaction.message.id].suggerimento)
                        .setThumbnail(client.users.cache.get(suggestions[messageReaction.message.id].user).avatarURL({ dynamic: true }))
                        .setFooter("Suggestion ID: " + messageReaction.message.id)


                    if (votiPos == 0 && votiNeg == 0) {

                    }
                    else {
                        var upvotes = 100 * votiPos / (votiPos + votiNeg)
                        if (upvotes % 1 != 0) {
                            upvotes = upvotes.toFixed(2)
                        }
                        var downvotes = 100 * votiNeg / (votiPos + votiNeg)
                        if (downvotes % 1 != 0) {
                            downvotes = downvotes.toFixed(2)
                        }
                        newEmbed
                            .addField("🥇Votes", "Opinion: " + (opinion > 0 ? "+" + opinion : opinion) + "\rUpvotes: " + votiPos + " - " + upvotes + "%\rDownvotes: " + votiNeg + " - " + downvotes + "%")
                    }

                    message.edit(newEmbed)
                })
        }
        if (messageReaction.message.channel.id == config.idCanaliServer.challenges) {
            if (!challenges.hasOwnProperty(messageReaction.message.id)) return
            if (messageReaction._emoji.name == "👍") {

                if (challenges[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id) < 0) {
                    challenges[messageReaction.message.id].totVotiPos.splice(challenges[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id), 1)


                }


            }
            else if (messageReaction._emoji.name == "👎") {
                if (challenges[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id) < 0) {
                    challenges[messageReaction.message.id].totVotiNeg.splice(challenges[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id), 1)

                }

            }


            var canale = client.channels.cache.get(config.idCanaliServer.challenges)
            canale.messages.fetch(messageReaction.message.id)
                .then(message => {

                    var votiPos = challenges[messageReaction.message.id].totVotiPos.length
                    var votiNeg = challenges[messageReaction.message.id].totVotiNeg.length

                    var opinion = votiPos - votiNeg

                    const newEmbed = new Discord.MessageEmbed()
                        .setTitle("🎯 Challenge by " + client.users.cache.get(challenges[messageReaction.message.id].user).username)
                        .setDescription(challenges[messageReaction.message.id].sfida)
                        .setThumbnail(client.users.cache.get(challenges[messageReaction.message.id].user).avatarURL({ dynamic: true }))
                        .setFooter("Challenge ID: " + messageReaction.message.id)


                    if (votiPos == 0 && votiNeg == 0) {

                    }
                    else {
                        var upvotes = 100 * votiPos / (votiPos + votiNeg)
                        if (upvotes % 1 != 0) {
                            upvotes = upvotes.toFixed(2)
                        }
                        var downvotes = 100 * votiNeg / (votiPos + votiNeg)
                        if (downvotes % 1 != 0) {
                            downvotes = downvotes.toFixed(2)
                        }
                        newEmbed
                            .addField("🥇Votes", "Opinion: " + (opinion > 0 ? "+" + opinion : opinion) + "\rUpvotes: " + votiPos + " - " + upvotes + "%\rDownvotes: " + votiNeg + " - " + downvotes + "%")
                    }

                    message.edit(newEmbed)


                })
        }

    } catch (err) {
        codeError(err)
    }
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;

    //KICK FROM #member-counter e #subscriber
    if (newUserChannel == "800802386587287562" || newUserChannel == "801717800137129994") {
        var server = client.guilds.cache.get(config.idGiulioAndCommunity);
        var utente = server.members.cache.find(x => x.id == newMember.id);
        utente.voice.kick()
    }

    //Ruolo @OnLive
    if (newUserChannel == "825419920727867402" && oldUserChannel != "825419920727867402") {
        var server = client.guilds.cache.get(config.idGiulioAndCommunity);
        var utente = server.members.cache.find(x => x.id == newMember.id);
        utente.roles.add(config.idRuoli.onLive);
    }
    if (newUserChannel != "825419920727867402" && oldUserChannel == "825419920727867402") {
        var server = client.guilds.cache.get(config.idGiulioAndCommunity);
        var utente = server.members.cache.find(x => x.id == newMember.id);
        utente.roles.remove(config.idRuoli.onLive);
    }
})


//Counter youtube
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get("801717800137129994")
        canale.setName("🎬│subscribers: " + response.subscriberCount)
    })
}, 1000 * 60)

//UPDATE USERSTATS-SERVERSTATS
setInterval(function () {
    var fareQuery = false;
    var query = "UPDATE userstats SET username = CASE ";
    userstatsList.forEach(userstats => {
        userstats.username = userstats.username.replace(/'/g, "");
        userstats.username = userstats.username.replace(/"/g, "");
        userstats.username = userstats.username.replace(/:/g, "");
        userstats.username = userstats.username.replace(/{/g, "");
        userstats.username = userstats.username.replace(/}/g, "");
        userstats.username = userstats.username.replace(/\[/g, "");
        userstats.username = userstats.username.replace(/]/g, "");
        userstats.username = userstats.username.replace(/,/g, "");

        userstats.username = userstats.username.trim();

        query += `WHEN id = '${userstats.id}' THEN '${userstats.username}' `
        fareQuery = true;
    });
    query += "END, roles = CASE "
    userstatsList.forEach(userstats => {
        query += `WHEN id = '${userstats.id}' THEN '${userstats.roles}' `
    });
    query += "END"

    if (fareQuery) {
        con.query(query, (err) => {
            if (err)
                codeError(err)
        })
    }

    if (serverstats) {
        serverstats.suggestions = JSON.stringify(suggestions)
        serverstats.challenges = JSON.stringify(challenges)

        con.query(`UPDATE serverstats SET suggestions = '${serverstats.suggestions}', challenges = '${serverstats.challenges}'`, (err) => {
            if (err)
                codeError(err)
        })
    }
}, 5000)

//SET MEMBER COUNTER
setInterval(function () {
    var server = client.guilds.cache.get(config.idGiulioAndCommunity);
    var botCount = server.members.cache.filter(member => member.user.bot).size;
    var utentiCount = server.memberCount - botCount;

    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + utentiCount)
}, 10000)

function addUserToDatabase(userstats) {
    con.query(`INSERT INTO userstats VALUES ('${userstats.id}','${userstats.username}', '${userstats.roles}');`, (err) => {
        if (err)
            codeError(err)
    })
}

function getCode(comando) {
    switch (comando) {
        case "ban": return `
client.on("message", message => {
    if (message.content.startsWith("!ban")) {
        var utenteKick = message.mentions.members.first();

        if (!message.member.hasPermission('BAN_MEMBERS')) { //Controllare che l'utente abbia il permesso di bannare
            message.channel.send('Non hai il permesso');
            return;
        }

        if (!utenteKick) {
            message.channel.send('Non hai menzionato nessun utente'); //Controllare che sia stato menzionato un utente
            return;
        }

        if (!message.mentions.members.first().kickable) { //Controllare che il bot abbia il permesso di bannare
            message.channel.send('Io non ho il permesso');
            return
        }

        utenteKick.ban()
            .then(() => message.channel.send("<@" + utenteKick + ">" + " bannato"))
    }
})`;
        case "tempban": return `
const mysql = require("mysql")
const ms = require("ms")

var con = mysql.createPool({ //Connessione database Heroku
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'username',
    password: "password",
    database: 'database'
})

client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        var tempban = JSON.parse(result[0].tempban)

        if (message.content.startsWith("!tempban")) {
            if (!message.member.hasPermission("BAN_MEMBERS")) {
                message.channel.send("Non hai il permesso");
                return
            }

            var utente = message.mentions.members.first();
            if (!utente) {
                message.channel.send("Utente non valido");
                return
            }

            if (tempban.hasOwnProperty(utente.user.id)) {
                message.channel.send("Questo utente è già bannato")
                return
            }

            var args = message.content.split(/\s+/);
            var time = args[2];
            if (!time) {
                message.channel.send("Inserire un tempo")
                return
            }

            time = ms(time);

            if (!time) {
                message.channel.send("Inserire un tempo valido")
                return
            }

            var reason = args.splice(3).join(" ");
            if (!reason) {
                reason = "Nessun motivo"
            }

            if (utente.hasPermission("ADMINISTRATOR")) {
                message.channel.send("Non puoi bannare questo utente")
                return
            }

            utente.ban({ reason: reason })

            tempban[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }

            message.channel.send(utente.toString() + " è stato bannato\rTime: " + ms(time, { long: true }) + "\rReason: " + reason)

            con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'")
        }
    })
})

setInterval(function () {
    con.query("SELECT * FROM serverstats", (err, result) => {
        var tempban = JSON.parse(result[0].tempban)

        for (var i = 0; i < Object.keys(tempban).length; i++) {

            tempban[Object.keys(tempban)[i]].time = tempban[Object.keys(tempban)[i]].time - 5;

            if (tempban[Object.keys(tempban)[i]].time <= 0) {
                var server = client.guilds.cache.get("idServer") //<--- INSERIRE ID DEL SERVER

                server.members.unban(Object.keys(tempban)[i])

                delete tempban[Object.keys(tempban)[i]]

            }
        }

        con.query("UPDATE serverstats SET tempban = '" + JSON.stringify(tempban) + "'");
    })
}, 5000)
        `;
        case "tempmute": return `
const mysql = require("mysql")
const ms = require("ms")

var con = mysql.createPool({ //Connessione database Heroku
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'username',
    password: "password",
    database: 'database',
})

client.on("message", message => {
    con.query("SELECT * FROM serverstats", async (err, result) => {
        var tempmute = JSON.parse(result[0].tempmute)

        if (message.content.startsWith("!tempmute")) {
            if (!message.member.hasPermission("MUTE_MEMBERS")) {
                message.channel.send("Non hai il permesso");
                return
            }

            var utente = message.mentions.members.first();
            if (!utente) {
                message.channel.send("Utente non valido");
                return
            }

            var ruolo = message.guild.roles.cache.find(role => role.name == "Muted");
            if (!ruolo) {
                ruolo = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        position: 1
                    }
                })
            }
            ruolo = message.guild.roles.cache.find(role => role.name == "Muted");

            message.guild.channels.cache.forEach((canale) => {
                canale.updateOverwrite(ruolo, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                })

            })

            if (tempmute.hasOwnProperty(utente.user.id) || utente.roles.cache.has(ruolo)) {
                message.channel.send("Questo utente è gia mutato")
                return
            }

            var args = message.content.split(/\s+/);
            var time = args[2];
            if (!time) {
                message.channel.send("Inserire un tempo")
                return
            }

            time = ms(time);

            if (!time) {
                message.channel.send("Inserire un tempo valido")
                return
            }

            var reason = args.splice(3).join(" ");
            if (!reason) {
                reason = "Nessun motivo"
            }

            if (utente.hasPermission("ADMINISTRATOR")) {
                message.channel.send("Non puoi mutare questo utente")
                return
            }

            utente.roles.add(ruolo)

            tempmute[utente.user.id] = {
                "time": time / 1000,
                "reason": reason
            }

            message.channel.send(utente.toString() + " è stato mutato\rTime: " + ms(time, { long: true }) + "\rReason: " + reason)

            con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "'")
        }
    })
})

setInterval(function () {
    con.query("SELECT * FROM serverstats", (err, result) => {
        var tempmute = JSON.parse(result[0].tempmute)
        var tempban = JSON.parse(result[0].tempban)

        for (var i = 0; i < Object.keys(tempmute).length; i++) {

            tempmute[Object.keys(tempmute)[i]].time = tempmute[Object.keys(tempmute)[i]].time - 5;

            if (tempmute[Object.keys(tempmute)[i]].time <= 0) {
                var server = client.guilds.cache.get("idServer") //<--- INSERIRE ID DEL SERVER

                try {
                    var utente = server.members.cache.find(x => x.id = Object.keys(tempmute)[i]);
                    var ruolo = server.roles.cache.find(role => role.name == "Muted");
                    utente.roles.remove(ruolo)
                    delete tempmute[Object.keys(tempmute)[i]]
                }
                catch {
                    delete tempmute[Object.keys(tempmute)[i]]
                }

            }
        }


        con.query("UPDATE serverstats SET tempmute = '" + JSON.stringify(tempmute) + "'");
    })
}, 5000)
        `;
        case "kick": return `
client.on("message", message => {
    if (message.content.startsWith("!kick")) {
        var utenteKick = message.mentions.members.first();

        if (!message.member.hasPermission('KICK_MEMBERS')) { //Controllare che l'utente abbia il permesso di bannare
            message.channel.send('Non hai il permesso');
            return;
        }

        if (!utenteKick) {
            message.channel.send('Non hai menzionato nessun utente'); //Controllare che sia stato menzionato un utente
            return;
        }

        if (!message.mentions.members.first().kickable) { //Controllare che il bot abbia il permesso di bannare
            message.channel.send('Io non ho il permesso');
            return
        }

        utenteKick.kick()
            .then(() => message.channel.send("<@" + utenteKick + ">" + " kiccato"))

    }
})`;
        case "clear": return `
client.on("message", message => {
    if (message.content.startsWith("!clear")) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) { //Controllare che l'utente abbia il permesso di cancellare messaggi
            message.channel.send('Non hai il permesso');
            return;
        }
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) { //Controllare che il bot abbia il permesso di cancellare messaggi
            message.channel.send('Non ho il permesso');
            return;
        }

        var count = message.content.slice(7); //Ottenere il numero inserito dall'utente
        count = parseInt(count);

        if (!count) {
            message.channel.send("Inserisci un numero valido")
            return
        }

        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            msg.delete({ timeout: 1000 })
        })

    }
})`;
        case "serverinfo": return `
client.on("message", message => {
    if (message.content == "!serverinfo") {
        var server = message.member.guild;

        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var utentiCount = server.memberCount - botCount;

        var categoryCount = server.channels.cache.filter(c => c.type == "category").size
        var textCount = server.channels.cache.filter(c => c.type == "text").size
        var voiceCount = server.channels.cache.filter(c => c.type == "voice").size

        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", server.owner.user.username, true)
            .addField("Server id", server.id, true)
            .addField("Server region", server.region, true)
            .addField("Members", "Total: " + server.memberCount + " - Users: " + utentiCount + " - Bots: " + botCount, false)
            .addField("Channels", "Category: " + categoryCount + " - Text: " + textCount + " - Voice: " + voiceCount, false)
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + server.premiumTier + " (Boost: " + server.premiumSubscriptionCount + ")", true)

        message.channel.send(embed)
    }
})`;
        case "userinfo": return `
client.on("message", message => {
    if (message.content.startsWith("!userinfo")) {
        if (message.content == "!userinfo") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first();
        }

        if (!utente) {
            message.channel.send("Non ho trovato questo utente")
            return
        }

        var elencoPermessi = "";
        if (utente.hasPermission("ADMINISTRATOR")) {
            elencoPermessi = "👑 ADMINISTRATOR";
        }
        else {
            var permessi = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

            for (var i = 0; i < permessi.length; i++) {
                if (utente.hasPermission(permessi[i])) {
                    elencoPermessi += "- " + permessi[i] + "\\r";
                }
            }
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("Tutte le info di questo utente")
            .setThumbnail(utente.user.avatarURL())
            .addField("User id", utente.user.id, true)
            .addField("Status", utente.user.presence.status, true)
            .addField("Is a bot?", utente.user.bot ? "Yes" : "No", true)
            .addField("Account created", utente.user.createdAt.toDateString(), true)
            .addField("Joined this server", utente.joinedAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)
            .addField("Roles", utente.roles.cache.map(ruolo => ruolo.name).join("\\r"), false)

        message.channel.send(embed)
    }
})`;
        case "roleinfo": return `
const { Permissions } = require('discord.js');

client.on("message", message => {
    if (message.content.startsWith("!roleinfo")) {
        var idRuolo = message.content.slice(13, -1);
        var ruolo = message.guild.roles.cache.get(idRuolo);

        if (!ruolo) {
            message.channel.send("Non ho trovato questo ruolo")
            return
        }

        var memberCount = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == ruolo)).size;

        var permessiRuolo = new Permissions(ruolo.permissions.bitfield);
        var elencoPermessi = "";
        if (permessiRuolo.has("ADMINISTRATOR")) {
            elencoPermessi = "👑ADMINISTRATOR";
        }
        else {
            var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

            for (var i = 0; i < permissions.length; i++) {
                if (permessiRuolo.has(permissions[i])) {
                    elencoPermessi += "- " + permissions[i] + "\r";
                }
            }
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(ruolo.name)
            .setDescription("Tutte le statistiche di questo ruolo")
            .addField("Role ID",ruolo.id, true)
            .addField("Members", memberCount, true)
            .addField("Color", ruolo.hexColor, true)
            .addField("Role created", ruolo.createdAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)

        message.channel.send(embed)
    }
})`;
        case "channelinfo": return `
client.on("message", message => {
    if (message.content.startsWith("!channelinfo")) {
        if (message.content == "!channelinfo") {
            var canale = message.channel;
        }
        else {
            var canale = message.mentions.channels.first();
        }

        if (!canale) {
            message.channel.send("Canale non trovato");
            return
        }

        switch (canale.type) {
            case "text": canale.type = "Text"; break;
            case "voice": canale.type = "Voice"; break;
            case "news": canale.type = "News"; break;
            case "category": canale.type = "Category"; break;
        }

        if (canale.type == "Voice") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questo canale")
                .addField("Channel ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition, true)
                .addField("Category", canale.parent.name, true)
                .addField("Bitrate", canale.bitrate, true)
                .addField("User limit", canale.userLimit == 0 ? "∞" : canale.userLimit, true)
            message.channel.send(embed)
            return
        }

        if (canale.type == "Category") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questa categoria")
                .addField("Category ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition, true)
                .addField("Category created", canale.createdAt.toDateString(), false)
            message.channel.send(embed)
            return
        }

        var lastMessage = canale.messages.fetch(canale.lastMessageID)
            .then(lastMessage => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField("Channel ID", canale.id, true)
                    .addField("Type", canale.type, true)
                    .addField("Position", canale.rawPosition, true)
                    .addField("Category", canale.parent.name, true)
                    .addField("Topic", !canale.topic ? "No topic" : canale.topic, true)
                    .addField("NSFW", canale.nsfw ? "Yes" : "No", true)
                    .addField("Last message", lastMessage.author.username + "#" + lastMessage.author.discriminator + " - " + lastMessage.content, true)
                    .addField("Channel created", canale.createdAt.toDateString(), false)
                message.channel.send(embed)
            })
            .catch(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField("Channel ID", canale.id, true)
                    .addField("Type", canale.type, true)
                    .addField("Position", canale.rawPosition, true)
                    .addField("Category", canale.parent.name, true)
                    .addField("Topic", !canale.topic ? "No topic" : canale.topic, true)
                    .addField("NSFW", canale.nsfw ? "Yes" : "No", true)
                    .addField("Last message", "Not found", true)
                    .addField("Channel created", canale.createdAt.toDateString(), false)
                message.channel.send(embed)
            });
    }
})`;
        case "avatar": return `
client.on("message", message => {
    if (message.content.startsWith("!avatar")) {
        if (message.content.trim() == "!avatar") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first();
        }

        if (!utente) {
            message.channel.send("Utente non trovato")
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("L'avatar di questo utente")
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))

        message.channel.send(embed)
    }
})`;
        case "say": return `
client.on("message", message => {
    if (message.content.startsWith("!say")) {
        var args = message.content.split(/\\s+/);
        var testo;
        testo = args.slice(1).join(" ");

        if (!testo) {
            message.channel.send("Inserire un messaggio");
            return
        }

        message.delete()
        message.channel.send(testo)
    }
})`;
        case "lastvideo": return `
const ytch = require('yt-channel-info');

client.on("message", message => {
    if (message.content == "!lastvideo") {
        const channelId = 'idCanaleYoutube' //Settare id del tuo canale YouTube
        const sortBy = 'newest'
        ytch.getChannelVideos(channelId, sortBy).then((response) => {
            var lastVideo = new Discord.MessageEmbed()
                .setTitle(response.items[0].title)
                .setURL("https://www.youtube.com/watch?v=" + response.items[0].videoId)
                .setThumbnail(response.items[0].videoThumbnails[3].url)
                .addField("Views", response.items[0].viewCount, true)
                .addField("Duration", response.items[0].durationText, true)
                .addField("Published", response.items[0].publishedText, true)

            message.channel.send(lastVideo)
        })
    }
})`;
        case "pagine": return `
client.on("message", message => {
    if (message.content == "!comando") {
        var totalPage = 4; //Ricordati qui si settare le tue pagine totali
        var page = 1;

        //TUTTE LE PAGINE - Puoi crearne quante ne vuoi
        var page1 = new Discord.MessageEmbed()
            .setTitle("PAGINA 1")
            .setDescription("Questa è la prima pagina")
            .setFooter("Page 1/" + totalPage)

        var page2 = new Discord.MessageEmbed()
            .setTitle("PAGINA 2")
            .setDescription("Questa è la seconda pagina")
            .setFooter("Page 2/" + totalPage)

        var page3 = new Discord.MessageEmbed()
            .setTitle("PAGINA 3")
            .setDescription("Questa è la terza pagina")
            .setFooter("Page 3/" + totalPage)

        var page4 = new Discord.MessageEmbed()
            .setTitle("PAGINA 4")
            .setDescription("Questa è la quarta pagina")
            .setFooter("Page 4/" + totalPage)

        message.channel.send(page1).then(msg => {
            msg.react('◀').then(r => { //Puoi se vuoi personalizzare le emoji
                msg.react('▶')

                const reactIndietro = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id
                const reactAvanti = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id

                const paginaIndietro = msg.createReactionCollector(reactIndietro)
                const paginaAvanti = msg.createReactionCollector(reactAvanti)

                paginaIndietro.on('collect', (r, u) => { //Freccia indietro
                    page--
                    page < 1 ? page = totalPage : ""
                    msg.edit(eval("page" + page))
                    r.users.remove(r.users.cache.filter(u => u === message.author).first())
                })
                paginaAvanti.on('collect', (r, u) => { //Freccia avanti
                    page++
                    page > totalPage ? page = 1 : ""
                    msg.edit(eval("page" + page))
                    r.users.remove(r.users.cache.filter(u => u === message.author).first())
                })
            })
        })
    }
})`;
        case "random": return `
client.on("message", message => {
    //Random messaggi normali
    if (message.content == "!comando") {
        var messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
        var random = Math.floor(Math.random() * messaggi.length);
        message.channel.send(messaggi[random]);
    }

    //Random messaggi embed
    if (message.content == "!comando2") {
        //Tutti gli embed
        var embed1 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il primo embed")
        var embed2 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il secondo embed")
        var embed3 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il terzo embed")
        var embed4 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il quarto embed")

        var messaggi = [embed1, embed2, embed3, embed4] //Qui potete elencare tutti gli embed che volete separati da una virgola
        var random = Math.floor(Math.random() * messaggi.length);
        message.channel.send(messaggi[random]);
    }
})`;
        case "notifica": return `
//Mettere tutto ciò fuori da tutto, quindi anche fuori da eventuali client.on("message") 
setInterval(function () {
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();

    if (hour == "18" && minutes == "32") { //Settare l'ora che si vuole, in questo momento viene mandato un messaggio in un canale tutti i giorni alle 18:32
        client.channels.cache.get("idCanale").send("Ciao!");
    }
}, 1000 * 60)`;
        case "taggare": return `
client.on("message", message => {
    if (message.content == "!comando") {
        //Taggare l'utente che scrive il comando
        message.channel.send(message.author.toString());
        //Taggare un utente specifico
        message.channel.send("<@idUtente>");
        //Taggare un ruolo del server
        message.channel.send("<@&idRuolo>");
        //Taggare un canale
        message.channel.send("<#idCanale>");
        //Taggare una categoria
        message.channel.send("<#idCategoria>");
    }
})`;
        case "ruoli": return `
client.on("message", message => {
    if (message.content == "!comando") {
        //DARE UN RUOLO
        message.member.roles.add("idRuolo") //A chi ha scritto il comando

        var utente = message.guild.members.cache.get("idUtente")
        utente.roles.add("idRuolo") //A un utente specifico

        //RIMUOVERE UN RUOLO
        message.member.roles.remove("idRuolo") //A chi ha scritto il comando

        var utente = message.guild.members.cache.get("idUtente")
        utente.roles.remove("idRuolo") //A un utente specifico
    }
})`;
        case "embed": return `
client.on("message", message => {
    if (message.content == "!comando") {
        const nomeEmbed = new Discord.MessageEmbed()
            .setTitle("Titolo") //Titolo
            .setColor("#34a42d") // Colore principale
            .setURL("UrlTitolo") //Link sul titolo
            .setAuthor("Autore") /*OPPURE*/.setAuthor("Autore", "LinkImmagine") //Autore
            .setDescription("Descrizione") //Descrizione
            .setThumbnail("UrlCopertina") //Copertina
            //Aggiungere elementi
            .addField("Titolo", "Contenuto", true / false) //QUI TUTTI I PARAMETRI SONO OBBLIGATORI - True o false = se questo elemento deve essere in linea con gli altri
            .setImage("LinkImmagine") //Immagine
            .setFooter("TestoFooter") /*OPPURE*/.setFooter("TestoFooter", "UrlImmagineFooter") // Testo piccolino in fondo
            .setTimestamp() //Se mettere o no l'orario di arrivo del messaggio

        message.channel.send(nomeEmbed)
    }
})`;
        case "soloruolo": return `
client.on("message", message => {
    if (message.content == "!comando") {
        if (message.member.roles.cache.has("idRuolo")) {
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai il ruolo");
        }
    }

    if (message.content == "!comando2") {
        if (message.member.roles.cache.has("idRuolo") || message.member.roles.cache.has("idRuolo2") || message.member.roles.cache.has("idRuolo3")) { //Più ruoli
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai i ruoli");
        }
    }
})`;
        case "solopermesso": return `
client.on("message", message => {
    if (message.content == "!comando") {
        if (message.member.hasPermission('BAN_MEMBERS')) { //Permesso di bannare
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        }
    }

    if (message.content == "!comando2") {
        if (message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('KICK_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) { //Più permessi
            //COMANDO
        } else {
            message.channel.send("Non puoi eseguire questo comando perchè non hai il permesso");
        }
    }
})`;
        case "counting": return `
const mysql = require("mysql")
const Parser = require("expr-eval").Parser

var con = mysql.createPool({ //Connessione database Heroku
        host: 'eu-cdbr-west-03.cleardb.net',
        port: 3306,
        user: 'username',
        password: "password",
        database: 'database',
})

var canaleCounting = "canaleCounting" //Settare il canale di counting del vostro server

client.on("message", message => {
        con.query("SELECT * FROM server", (err, result) => {
                if (err) {
                        console.log(err)
                        return
                }

                var server = result[0]

                con.query("SELECT * FROM user", (err, result) => {
                        if (err) {
                                console.log(err)
                                return
                        }

                        var userList = result;

                        if (message.channel == canaleCounting) {
                                try {
                                        var numero = Parser.evaluate(message.content)

                                        var index = userList.findIndex(x => x.id == message.author.id)
                                        if (index < 0) {
                                                var index = userList.lenght;
                                                userList[index] = {
                                                        id: message.author.id,
                                                        username: message.member.user.tag,
                                                        lastScore: 0,
                                                        bestScore: 0,
                                                        correct: 0,
                                                        incorrect: 0
                                                }

                                                con.query("INSERT INTO user VALUES (" + message.author.id + ",'" + message.member.user.tag + "', 0, 0, 0, 0)", (err) => {
                                                        if (err) {
                                                                console.log(err)
                                                                return
                                                        }
                                                })
                                        }
                                        var user = userList[index];

                                        if (message.author.id == server.ultimoUtente) {
                                                message.react("🔴")
                                                message.channel.send("ERRORE - Ogni utente può scrivere un numero alla volta")

                                                user.incorrect = user.incorrect + 1;

                                                server.numero = 0;
                                                server.ultimoUtente = "NessunUtente";
                                                server.bestScore = server.bestScore;
                                        }
                                        else if (numero - 1 != server.numero) {
                                                message.react("🔴")
                                                message.channel.send("ERRORE - Hai scritto un numero sbagliato")

                                                user.incorrect = user.incorrect + 1;

                                                server.numero = 0;
                                                server.ultimoUtente = "NessunUtente";
                                                server.bestScore = server.bestScore;
                                        }
                                        else {
                                                numero >= server.bestScore ? message.react("🔵") : message.react("🟢")

                                                server.numero = server.numero + 1;
                                                server.ultimoUtente = message.author.id;
                                                numero >= server.bestScore ? server.bestScore = numero : server.bestScore = server.bestScore

                                                user.lastScore = numero;
                                                numero >= user.bestScore ? user.bestScore = numero : user.bestScore = user.bestScore;
                                                user.correct = user.correct + 1
                                        }

                                        updateDatabase(user, server)

                                } catch {

                                }
                        }

                        if (message.content.startsWith("!cuser")) {
                                if (message.content == "!cuser") {
                                        var utente = message.member;
                                }
                                else {
                                        var utente = message.mentions.members.first()
                                }

                                if (!utente) {
                                        message.channel.send("Utente non trovato");
                                        return
                                }

                                var index = userList.findIndex(x => x.id == message.author.id)
                                if (index < 0) {
                                        message.channel.send("Questo utente non ha mai giocato a Couting")
                                        return
                                }

                                var user = userList[index]

                                var leaderboard = userList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
                                var position = leaderboard.findIndex(x => x.id == utente.user.id)

                                var embed = new Discord.MessageEmbed()
                                        .setTitle("COUTING USER STATS")
                                        .setDescription("Tutte le statistiche di questo utente su couting")
                                        .setThumbnail(utente.user.avatarURL())
                                        .addField("Last score", user.lastScore, true)
                                        .addField("Best score", user.bestScore, true)
                                        .addField("Position", position, true)
                                        .addField("Correct", user.correct, true)
                                        .addField("Incorrect", user.incorrect, true)

                                message.channel.send(embed)

                        }

                        if (message.content == "!cserver") {
                                var leaderboardList = userList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))

                                var leaderboard = "";
                                for (var i = 0; i < 10; i++) {
                                        if (leaderboardList.length - 1 < i) {
                                                break
                                        }
                                        leaderboard += "**#" + (i + 1) + "** - " + leaderboardList[i].username + " - **" + leaderboardList[i].bestScore + "**\r";
                                }

                                var embed = new Discord.MessageEmbed()
                                        .setTitle("COUNTING SERVER STATS")
                                        .setDescription("Tutte le statistiche del server su counting")
                                        .setThumbnail(message.member.guild.iconURL())
                                        .addField("Numero", server.numero, true)
                                        .addField("Ultimo utente", server.ultimoUtente != "NessunUtente" ? server.ultimoUtente : "Nessun utente", true)
                                        .addField("Best score", server.bestScore, true)
                                        .addField("Leaderboard", leaderboard, false)
                                message.channel.send(embed)

                        }
                })
        })
})


function updateDatabase(user, server) {
        con.query("UPDATE server SET numero = " + server.numero + ", ultimoUtente = '" + server.ultimoUtente + "', bestScore = " + server.bestScore, (err) => {
                if (err) {
                        console.log(err);
                        return
                }
        })

        con.query("UPDATE user SET lastScore = " + user.lastScore + ", bestScore = " + user.bestScore + ", correct = " + user.correct + ", incorrect = " + user.incorrect + " WHERE id = " + user.id, (err) => {
                if (err) {
                        console.log(err);
                        return
                }
        })
}
        `;
        case "modificare": return `
client.on("message", message => {
    //Modificare un messaggio appena inviato
    if (message.content == "!comando") {
        message.channel.send("Ciao")
            .then(msg => {
                //Appena inviato
                msg.edit("Messaggio modificato")

                //Dopo due secondi
                setTimeout(function () {
                    msg.edit("Messaggio modificato")
                }, 2000) //Personalizzabile

            })
    }

    //Modificare un messaggio specifico nel server
    if (message.content == "!comando1") {
        var canale = client.channels.cache.get("idCanale") //Settare id canale in cui si trova il messaggio
        canale.messages.fetch("idMessaggio") //Settare id messaggio
            .then(msg => {
                msg.edit("Messaggio modificato")
            })
    }
})`;
        case "cancellare": return `
client.on("message", message => {
    if (message.content == "!comando") {

        //Cancellare il comando dell'utente
        message.delete(); //Immediatamente
        message.delete({ timeout: 3000 }) //Dopo tre secondi (personalizzabile)

        //Cancellare il messaggio del bot
        message.channel.send("Ciao")
            .then(msg => {
                msg.delete(); //Immediatamente
                msg.delete({ timeout: 3000 }) //Dopo tre secondi (personalizzabile)
            })
    }
})`;
        case "crearecanale": return `
client.on("message", message => {
    if (message.content == "!comando") {
        message.guild.channels.create("NomeCanale", { //Nome canale
            type: "text",
        }).then((canale) => {
            //SETTAGGI OPZIONALI
            canale.setTopic("Descrizione"); //Descrizione (topic)
            canale.setParent("idCategoria"); //Categoria
            canale.overwritePermissions([
                /*
                    id = id dell'utente/ruolo
                    allow = permessi che vengono concesse in quel canale
                    deny = permessi che vengono tolte in quel canale
                */
                {
                    id: message.guild.id, //everyone
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.member.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ]);
        })
    }
})`;
        case "cancellarecanale": return `
client.on("message", message => {
    if (message.content == "!comando") {
        //Cancellare il canale del comando
        message.channel.delete();

        //Cancellare un canale specifico
        var canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.delete();
    }
})`;
        case "nomecanale": return `
client.on("message", message => {
    if (message.content == "!comando") {
        //Cambiare il canale del comando
        message.channel.setName("nome modificato")

        //Cambiare un canale specifico
        var canale = client.channels.cache.get("idCanale"); //Settare id canale
        canale.setName("nome modificato")
    }
})`;
        case "ticket": return `
//Prima di tutto mandare il messaggio del ticket
client.on("message", message => {
    if (message.content == "!ciao") {
        message.channel.send("Clicca sulla reazione per aprire un ticket")
            .then(msg => msg.react("📩")) //Personalizzare l'emoji della reaction
    }
})

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (messageReaction._emoji.name == "📩") { //Personalizzare l'emoji della reaction
        if (messageReaction.message.channel.id == "idCanale") { //Settare canale
            messageReaction.users.remove(user);
            var server = messageReaction.message.channel.guild;
            if (server.channels.cache.find(canale => canale.topic == \`User ID: \${user.id}\`)) {
                user.send("Hai gia un ticket aperto").catch(() => { })
                return
            }

            server.channels.create(user.username, {
                type: "text"
            }).then(canale => {
                canale.setTopic(\`User ID: \${user.id}\`);
                canale.setParent("idCategoria") //Settare la categoria
                canale.overwritePermissions([
                    {
                        id: server.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }
                ])
                canale.send("Grazie per aver aperto un ticket")
            })
        }
    }
})

client.on("message", message => {
    if (message.content == "!close") {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                message.channel.delete();
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }

    if (message.content.startsWith("!add")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }

                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)

                if (haIlPermesso) {
                    message.channel.send("Questo utente ha gia accesso al ticket")
                    return
                }

                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: true
                })

                message.channel.send(\`\${utente.toString()} è stato aggiunto al ticket\`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("!remove")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }

                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)

                if (!haIlPermesso) {
                    message.channel.send("Questo utente non ha gia accesso al ticket")
                    return
                }

                if (utente.hasPermission("MANAGE_CHANNELS")) {
                    message.channel.send("Non puoi rimuovere questo utente")
                    return
                }

                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: false
                })

                message.channel.send(\`\${utente.toString()} è stato rimosso al ticket\`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
})
        `;
        case "welcome": return `
//BENVENUTO
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

    var canale = client.channels.cache.get("idCanale") //Settare il canale di benvenuto
    canale.send(\`
-------------- WELCOME --------------
Ciao \${member.toString()}, benvenuto in \${member.guild.name}
Sei il **\${member.guild.memberCount}° Membro** 
Prima di fare altro, leggi le <#793781895829258260>
Puoi vedere tutte le informazioni sul server in <#793781897619570738>\`)
});

//ADDIO
client.on("guildMemberRemove", member => {
    if (member.user.bot) return

    var canale = client.channels.cache.get("idCanale") //Settare il canale di addio
    canale.send(\`
-------------- GOODBYE --------------
Ciao \${member.toString()}, ci rivediamo presto qua in \${member.guild.name}\`)
});`;
        case "welcomeruolo": return `
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

    member.roles.add("idRuolo");
});`;
        case "membercounter": return `
client.on("guildMemberAdd", member => { //Update canale quando entra un utente dal server
    var canale = client.channels.cache.get("idCanaleCounter")
    canale.setName("members: " + member.guild.memberCount)
});
client.on("guildMemberRemove", member => { //Update canale quando esce un utente dal server
    var canale = client.channels.cache.get("idCanaleCounter")
    canale.setName("members: " + member.guild.memberCount)
});`;
        case "stato": return `
client.on('ready', () => {
    //Stato classico (Sta guardando..., Sta giocando a...)
    client.user.setActivity('Testo', { type: 'WATCHING' }); //Oppure LISTENING, PLAYING

    //Streamimg
    client.user.setActivity("Testo", {
        type: "STREAMING",
        url: "https://www.twitch.tv/nomeutente"
    });

    //Stato online/offine/non disturbare...
    client.user.setStatus('online') //Oppure idle, dnd, invisible
})`;
        case "errore1": return `
require('events').EventEmitter.prototype._maxListeners = 100;`;
        case "canale": return `
var canale = client.channels.cache.get("idCanale");
canale.send("Messaggio");`;
        case "utente": return `
var utente = client.users.cache.get("idUtente");
utente.send("messaggio");`;
    }
}


setInterval(function(){
    var data = new Date()
    if(data.getHours() == 17 && (data.getMinutes() == 36 || data.getMinutes() == 1) && data.getSeconds() == 0){
        const channelId = 'UC6WJ32r35demIRvxV-xDU2g'
        const sortBy = 'newest'
        ytch.getChannelVideos(channelId, sortBy).then((response) => {

            var canale = client.channels.cache.get("793781905740922900");
            canale.send(`
-------------:red_circle: 𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎 :red_circle:-------------
Ehy ragazzi, è appena uscito un nuovo video su GiulioAndCode
Andate subito a vedere **${response.items[0].title}**

https://www.youtube.com/watch?v=${response.items[0].videoId}
<@&857544584691318814>`)
        })
    }
},1000*60)