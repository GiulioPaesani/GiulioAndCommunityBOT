const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const ytch = require('yt-channel-info');
const { Permissions } = require('discord.js');
//const fs = require("file-system");
const mysql = require('mysql');
const moment = require('moment');

client.login(process.env.token);

client.on("ready", () => {
    console.log("-----GIULIOANDCOMMUNITYBOT ONLINE-----")

    client.user.setActivity('!help', { type: 'WATCHING' });

    var utente = client.users.cache.get("793768313934577664");
    var embed = new Discord.MessageEmbed()
        .setTitle("GiulioAndCommunity BOT è ONLINE")
        .setThumbnail("https://i.postimg.cc/pLYkGfD1/Profilo-bot.png")
        .setColor("#71A4FF")
    utente.send(embed);
})

var con = mysql.createPool({ //Connessione database Heroku
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: 'eu-cdbr-west-03.cleardb.net',
    port: 3306,
    user: 'b0e6f9bf85a35f',
    password: process.env.passworddb,
    database: 'heroku_e1befae4f922504',
    charset: 'utf8mb4'
})

var canaleSuggestions = "793781902728495104";
var embedSuggestion = new Discord.MessageEmbed()

var canaleChallenge = "815611596042666034";
var embedChallenge = new Discord.MessageEmbed()

var canaleAttesa = "825421415733657640"
var canaleLive = "825419920727867402";
var canaleGeneral = "799969178039091230";
var ruoloOnLive = "825422966262988811"

var idServer = "793776260350083113"

var ruoliMod = [
    "793796029878370326", //ADMIN
    "831575570151505940", //MOD "FINTO"
    "799925821904125962", //MOD
    "793804156430188594", //BOT
]

var utentiSceltiPrima = []

client.on("message", (message) => {
    if (message.author.bot) return
    if (message.channel.type == "dm") return

    if (message.guild.id != "793776260350083113") return

    message.content = message.content.trim().toLowerCase();

    if (message.channel == "804688929109966848" && !message.content.startsWith("!clear")) return

    if (message.channel.id == "793781901688963104" && !message.content.startsWith("!suggest") && !message.content.startsWith("!suggerisci") && !message.content.startsWith("!suggerimento")) {
        message.delete({ timeout: 1000 })
    }
    if (message.channel.id == "815611328022315028" && !message.content.startsWith("!challenge") && !message.content.startsWith("!sfida")) {
        message.delete({ timeout: 1000 })
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

    con.query(`SELECT * FROM serverstats`, function (err, result, fields) {
        if (err) {
            console.log(err);
            return
        }
        var serverstats = result[0]; //Get serverstats

        //CANCELLARE COMANDO IN CANALE SBAGLIATO
        var BOT = {
            voiceMaster: {
                comandi: ["%voice", "%voice lock", "%voice unlock", "%voice name", "%voice limit", "%voice permit", "%voice reject", "%voice claim", "@voicemaster myprefix", "%aboutme", "%stats", "%ping", "%invite"],
                id: "472911936951156740",
                canaliPermessi: ["801019779480944660"]
            },
            plasma: {
                comandi: ["$ranks", "$inviteinfo", "$invites"],
                id: "716967712844414996",
                canaliPermessi: ["801019779480944660"]
            },
            ticket: {
                comandi: ["t!open"],
                id: "508391840525975553",
                canaliPermessi: ["801019779480944660"]
            },
            groovy: {
                comandi: ["-play", "-play file", "-join", "-queue", "-p", "-q", "-pf", "-f", "-j", "-nest", "-n", "-skip", "-back", "-b", "-previous", "-prev", "-clear", "-jump", "-j", "-goto", "-loop", "-lt", "-ls", "-lq", "-lyrics", "-ly", "-pause", "-resume", "-unpause", "-remove", "-r", "-rm", "-delete", "-del", "-rr", "-disconnect", "-dc", "-leave", "-reset", "-shuffle", "-shuff", "-shuf", "-randomize", "-randomise", "-song", "-nowplayling", "-np", "-reset effects", "-fast forward", "-ff", "-fwd", "-rewind", "-rw", "-search", "-s", "-seek", "-stop", "-move", "-m", "-prefix", "-announce", "-perms"],
                id: "234395307759108106",
                canaliPermessi: ["799969723776892969"]
            }

        }

        var comandiGiulioAndCommunityBot = {
            "!test": [],
            "!changelog": [],

            "-!code": ["801019779480944660"],

            "!server": ["801019779480944660"],
            "!serverinfo": ["801019779480944660"],
            "!serverstats": ["801019779480944660"],

            "-!user": ["801019779480944660"],
            "-!userinfo": ["801019779480944660"],
            "-!userstats": ["801019779480944660"],

            "-!role": ["801019779480944660"],
            "-!roleinfo": ["801019779480944660"],
            "-!rolestats": ["801019779480944660"],

            "-!avatar": ["801019779480944660"],

            "!youtube": ["801019779480944660"],
            "!twitch": ["801019779480944660"],
            "!live": ["801019779480944660"],
            "!giulioandlive": ["801019779480944660"],

            "!lastvideo": ["801019779480944660"],
            "!ultimovideo": ["801019779480944660"],

            "!github": ["801019779480944660"],


            "-!cuser": ["801019779480944660", "793781899796938802"],
            "-!cuserstats": ["801019779480944660", "793781899796938802"],
            "-!cuserinfo": ["801019779480944660", "793781899796938802"],

            "-!cserver": ["801019779480944660", "793781899796938802"],
            "-!cserverstats": ["801019779480944660", "793781899796938802"],
            "-!cserverinfo": ["801019779480944660", "793781899796938802"],

            "-!cset": [],

            "-!suggest": ["793781901688963104"],
            "-!suggerisci": ["793781901688963104"],
            "-!suggerimento": ["793781901688963104"],

            "-!challenge": ["815611328022315028"],
            "-!sfida": ["815611328022315028"],

            "-!sdelete": [],
            "-!cdelete": [],

            "!help": ["801019779480944660"],
            "!aiuto": ["801019779480944660"],
            "!comandi": ["801019779480944660"],

            "-!rank": ["801019779480944660"],
            "-!level": ["801019779480944660"],
            "!leaderboard": ["801019779480944660"],
            "!lb": ["801019779480944660"],

            "-!setlevel": [],
            "-!setrank": [],

            "-!slowmode": [],

            "-!clear": [],

            "-!warn": [],

            "-!infraction": ["801019779480944660"],
            "-!infractions": ["801019779480944660"],
            "-!infrazioni": ["801019779480944660"],

            "-!clearinfractions": [],
            "-!clearinfraction": [],
            "-!clearinfrazioni": [],
            "-!clearwarn": [],

            "-!ban": [],

            "-!unban": [],

            "-!mute": [],
            "-!unmute": [],

            "-!kick": [],

            "-!tempmute": [],

            "-!tempban": [],

            "-!bug": ["801019779480944660"],
            "-!report": ["801019779480944660"],

            "-!tget": [],
            "-!tstop": [],
            "-!tend": [],
            "!tchance": ["801019779480944660", "825424089534824448"],
            "-!tban": [],
            "-!tkick": [],
            "-!tunban": [],

            "!config": ["801019779480944660"],
            "!notifiche": ["801019779480944660"],
            "!notification": ["801019779480944660"],
            "!notifications": ["801019779480944660"],
        }

        var nomeComando;

        var utenteMod = false;
        for (var i = 0; i < ruoliMod.length; i++) {
            if (message.member.roles.cache.has(ruoliMod[i])) utenteMod = true;
        }

        var canaleNotConcessoBot = false;
        var trovatoGiulioAndCommunityBot = false;
        var trovatoBot = false

        for (var i = 0; i < Object.keys(BOT).length; i++) {
            for (var x = 0; x < eval("BOT." + Object.keys(BOT)[0]).comandi.length; x++) {
                if (message.content.startsWith(eval("BOT." + Object.keys(BOT)[i]).comandi[x])) {
                    trovatoBot = true;
                    if (!eval("BOT." + Object.keys(BOT)[i]).canaliPermessi.includes(message.channel.id)) {
                        canaleNotConcessoBot = true
                    }
                }
            }
        }


        if (canaleNotConcessoBot) { //Comando bot in canale non concesso
            var canaliAdmin = ["804688929109966848", "793781905740922900", "793781906478858269"]

            console.log(message.member.hasPermission("ADMINISTRATOR"))
            console.log(message.content.startsWith("!code") || message.content.startsWith("!infractions") || message.content.startsWith("!infraction") || message.content.startsWith("!infrazioni"))


            if (!canaliAdmin.includes(message.channel.id) && !(utenteMod && (message.content.startsWith("!code") || message.content.startsWith("!infractions") || message.content.startsWith("!infraction") || message.content.startsWith("!infrazioni")))) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `" + message.content + "` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }
        }

        if (!trovatoBot) {
            for (var i = 0; i < Object.keys(comandiGiulioAndCommunityBot).length; i++) {
                if (Object.keys(comandiGiulioAndCommunityBot)[i][0] == "-") {
                    if (message.content.startsWith(Object.keys(comandiGiulioAndCommunityBot)[i].slice(1))) {
                        trovatoGiulioAndCommunityBot = true;
                        nomeComando = Object.keys(comandiGiulioAndCommunityBot)[i]
                        if (message.content.length != Object.keys(comandiGiulioAndCommunityBot)[i].length - 1) {
                            if (message.content.slice(Object.keys(comandiGiulioAndCommunityBot)[i].length - 1)[0] != " ") {
                                trovatoGiulioAndCommunityBot = false;
                            }
                        }
                    }
                }
                else {
                    if (message.content == Object.keys(comandiGiulioAndCommunityBot)[i]) {
                        trovatoGiulioAndCommunityBot = true;
                        nomeComando = Object.keys(comandiGiulioAndCommunityBot)[i]

                    }
                }
            }
        }

        var canaleNotConcesso = false;
        if (trovatoGiulioAndCommunityBot) { //Comando esistente
            for (var i = 0; i < Object.keys(comandiGiulioAndCommunityBot).length; i++) {//Controllo canale corretto
                for (var j = 0; j < eval("comandiGiulioAndCommunityBot['" + nomeComando + "']").length; j++) {
                    if (eval("comandiGiulioAndCommunityBot['" + nomeComando + "']")[j] != message.channel.id) {
                        canaleNotConcesso = true;
                    }
                    else {
                        canaleNotConcesso = false;
                        break
                    }
                }
            }

            if (nomeComando[0] == "-") {
                nomeComando = nomeComando.slice(1)
            }

            if (canaleNotConcesso) {
                var canaliAdmin = ["804688929109966848", "793781905740922900", "793781906478858269"]

                if (!canaliAdmin.includes(message.channel.id) && !(utenteMod && (message.content.startsWith("!code") || message.content.startsWith("!infractions") || message.content.startsWith("!infraction") || message.content.startsWith("!infrazioni")))) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Canale non concesso")
                        .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                        .setColor("#F15A24")
                        .setDescription("Non puoi utilizzare il comando `" + nomeComando + "` in questo canale")

                    var canaliConcessi = ""
                    console.log("nomecomando", nomeComando)
                    if (comandiGiulioAndCommunityBot[nomeComando]) {
                        for (var i = 0; i < comandiGiulioAndCommunityBot[nomeComando].length; i++) {
                            canaliConcessi += "<#" + comandiGiulioAndCommunityBot[nomeComando][i] + ">\r"
                        }
                    }
                    else {
                        for (var i = 0; i < comandiGiulioAndCommunityBot["-" + nomeComando].length; i++) {
                            canaliConcessi += "<#" + comandiGiulioAndCommunityBot["-" + nomeComando][i] + ">\r"
                        }
                    }


                    embed
                        .addField("Puoi usare questo comando in:", canaliConcessi)

                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 7000 })
                        msg.delete({ timeout: 7000 })
                    })
                    return
                }
            }
        }
        else {
            if (message.content.startsWith("!") && !trovatoBot && !message.content.startsWith("!!") && message.content != "!") {
                //Comando non esistente
                var embed = new Discord.MessageEmbed()
                    .setTitle("Comando non esistente")
                    .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")
                    .setColor("#FF931E")
                    .setDescription("Il comando `" + message.content + "` non esiste")

                if (message.channel != "793781905740922900") {


                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 7000 })
                        msg.delete({ timeout: 7000 })
                    })
                    return
                }
            }
        }

        //TEST
        if (message.content == "!test") {
            if (!utenteMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!test` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var testo = "";
            var GiulioAndCommunityBOT = message.guild.members.cache.get('802184359120863272')
            var GiulioAndTutorial = message.guild.members.cache.get('796398486828089364')
            var GiulioAndModeration = message.guild.members.cache.get('821364574212587550')
            var GiulioAndFun = message.guild.members.cache.get('821364707617013771')
            var GiulioAndLeveling = message.guild.members.cache.get('821347785722822676')

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
        if (message.content.startsWith("!bug ") || message.content.startsWith("!report ")) {
            if (message.content.startsWith("!bug"))
                var report = message.content.slice(5).trim()
            if (message.content.startsWith("!report"))
                var report = message.content.slice(8).trim()

            if (!report && !(message.attachments).array()[0]) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Scrivi un report")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!bug [report]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var embed = new Discord.MessageEmbed()
                .setTitle("Bug reportato")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .addField(":bust_in_silhouette: User", "```" + message.member.user.tag + "```", false)

            if (report)
                embed.addField(":beetle: Bug", "```" + report + "```", false)

            message.delete({ timeout: 7000 });

            if ((message.attachments).array()[0])
                embed.setImage((message.attachments).array()[0].url)

            message.channel.send(embed)
                .then((msg) => {
                    msg.delete({ timeout: 7000 })
                })

            var canale = client.channels.cache.get("793781906478858269");
            canale.send(embed);

        }
        //HELP
        if (message.content == "!help" || message.content == "!aiuto" || message.content == "!comandi") {
            var totalPage = 6;
            var page = 0;
            var page0 = new Discord.MessageEmbed()
                .setTitle("Tutti i comandi")
                .setDescription(`
            Tutti i comandi di bot ufficali presenti sul server

            <:GiulioAndCommunityBOT:823196000650788944> **GiulioAndCommunity BOT** - Bot ufficiale con comandi specifici per questo server
            <:GiulioAndFun:823196000704528424> **GiulioAndFun** - Bot dedicato ai comandi e ai piccoli giochi di divertimento
            <:GiulioAndLeveling:823196001153187841> **GiulioAndLeveling** - Bot esclusivamente per il sistema di livellamento
            <:GiulioAndModeration:823196000721960990> **GiulioAndModeration** - Bot con i comandi e funzioni per la moderazione nel server`)
                .setThumbnail("https://i.postimg.cc/HkwQSy31/Profilo-bot.png")

            var page1 = new Discord.MessageEmbed()
                .setTitle(":bar_chart: Statistics")
                .setDescription("Comandi relativi alla infomazioni e statistiche")
                .addField(":desktop: Commands", `
            -\`!serverinfo\`
            Informazioni complete sul server
            Alias: \`!serverstats\` \`!server\`

            -\`!userinfo [user]\`
            Informazioni su un utente
            Alias: \`!userstats\` \`!user\`

            -\`!roleinfo [role]\`
            Informazioni su un ruolo
            Alias: \`!rolestats\` \`!role\`

            -\`!avatar [user]\`
            Ottenere l'immagine profilo di un utente\r
            `)
                .addField(":no_entry: Canali concessi", "<#801019779480944660>")
                .setFooter("Page 1/" + totalPage)

            var page2 = new Discord.MessageEmbed()
                .setTitle(":100: Counting")
                .setDescription("Comandi del giochino di Counting")
                .addField(":desktop: Commands", `
            -\`!cserver\`
            Statistiche di Counting del server
            Alias: \`!cserverstats\` \`!cserverinfo\`

            -\`!cuser [user]\`
            Statistiche di Counting di un utente
            Alias: \`!cuserstats\` \`!cuserinfo\`

            `)
                .addField(":no_entry: Canali concessi", "<#801019779480944660>\r<#793781899796938802>")
                .setFooter("Page 2/" + totalPage)

            var page3 = new Discord.MessageEmbed()
                .setTitle(":film_frames: YouTube")
                .setDescription("Comandi relativi al canale")
                .addField(":desktop: Commands", `
            -\`!youtube\`
            Ottenere il link del canale YouTube

            -\`!lastvideo\`
            Ottenere il link dell'ultimo video uscito
            Alias: \`!ultimovideo\`

            -\`!twitch\`
            Ottenere il link del canale Twitch e GiulioAndLive
            Alias: \`!live\` \`!giulioandlive\`

            -\`!github\`
            Ottenere il link del GitHub di tutti i bot ufficiali

            -\`!code (codice)\`
            Informazioni e codice relativi a funzioni e comandi in Discord.js

            -\`!config\`
            Personalizzare le preferenze di notifiche nel server
            Alias: \`!notifiche\` \`!notification\` \`!notifications\`
            `)
                .addField(":no_entry: Canali concessi", "<#801019779480944660>")
                .setFooter("Page 3/" + totalPage)

            var page4 = new Discord.MessageEmbed()
                .setTitle(":bulb: Suggestions")
                .setDescription("Comandi per suggerimenti")
                .addField(":desktop: Commands", `
            -\`!suggest [suggerimento]\`
            Eseguire un suggerimento per il canale/server
            Alias: \`!suggerisci\` \`!suggerimento\`
            `)
                .addField(":no_entry: Canali concessi", "<#793781901688963104>")
                .setFooter("Page 4/" + totalPage)

            var page5 = new Discord.MessageEmbed()
                .setTitle(":dart: Challenge")
                .setDescription("Comandi per sfide")
                .addField(":desktop: Commands", `
            -\`!challenge [sfida]\`
            Proprorre una sfida
            Alias: \`!sfida\`
            `)
                .addField(":no_entry: Canali concessi", "<#815611328022315028>")
                .setFooter("Page 5/" + totalPage)

            var page6 = new Discord.MessageEmbed()
                .setTitle(":beginner: Leveling")
                .setDescription("Comandi di livellamento")
                .addField(":desktop: Commands", `
            -\`!rank (user)\`
            Visualizzare il tuo rank o di un utente specifico
            Alias: \`!level\`

            -\`!leaderboard\`
            Visualizzare la classifica dei migliori 10 utenti del server
            Alias: \`!lb\`
            `)
                .addField(":no_entry: Canali concessi", "<#801019779480944660>")
                .setFooter("Page 6/" + totalPage)

            message.channel.send(page0).then(msg => {
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
            //https://www.npmjs.com/package/yt-channel-info
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
                .setDescription(`Questi sono i link Github dei codici dei bot ufficiali
                
                <:GiulioAndCommunityBOT:823196000650788944> GiulioAndCommunity BOT - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndCommunityBOT)
                <:GiulioAndModeration:823196000721960990> GiulioAndModeration - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndModeration)
                <:GiulioAndFun:823196000704528424> GiulioAndFun - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndFun)
                <:GiulioAndLeveling:823196001153187841> GiulioAndLeveling - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndLeveling)`)
                .setThumbnail("https://i.postimg.cc/mrXPWCHK/Senza-titolo-1.jpg")

            message.channel.send(embed)
        }
        //SERVERINFO
        if (message.content.startsWith("!server")) {
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
                .addField(":calendar_spiral: Server created", "```" + server.createdAt.toDateString() + "```", true)
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
                if (!utente) { //Per id
                    var args = message.content.split(/\s+/);
                    var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1]))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1])))[0]];
                    if (!utente) { //Per username
                        if (message.content.startsWith("!userstats")) {
                            var nome = message.content.slice(11).trim()
                        }
                        else if (message.content.startsWith("!userinfo")) {
                            var nome = message.content.slice(10).trim()

                        }
                        else {
                            var nome = message.content.slice(6).trim()
                        }
                        var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase())))[0]];
                        if (!utente) { //Per tag
                            var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase())))[0]];
                        }
                    }
                }
            }

            if (!utente) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!userinfo [user]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var ruoli = utente._roles

            var elencoRuoli = "";
            for (var i = 0; i < ruoli.length; i++) {
                var ruolo = message.guild.roles.cache.find(role => role.id == ruoli[i]);
                elencoRuoli += "- " + ruolo.name + "\r";
            }

            if (elencoRuoli == "") {
                elencoRuoli = "Nessun ruolo";
            }

            var elencoPermessi = "";
            if (utente.hasPermission("ADMINISTRATOR")) {
                elencoPermessi = "👑ADMINISTRATOR";
            }
            else {
                var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]

                for (var i = 0; i < permissions.length; i++) {
                    if (utente.hasPermission(permissions[i])) {
                        elencoPermessi += "- " + permissions[i] + "\r";
                    }
                }
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
            if (!userFlags.length) {
                elencoBadge = "Nessun badge"
            }
            else {
                userFlags.forEach(badge => {
                    elencoBadge += "- " + badge + "\r";
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
            if (!ruolo) { //Per id
                var args = message.content.split(/\s+/);
                var ruolo = Object.fromEntries(message.guild.roles.cache.filter(ruolo => ruolo.id == args[1]))[Object.keys(Object.fromEntries(message.guild.roles.cache.filter(ruolo => ruolo.id == args[1])))[0]];
                if (!ruolo) { //Per nome
                    if (message.content.startsWith("!rolestats")) {
                        var nome = message.content.slice(11).trim()
                    }
                    else if (message.content.startsWith("!roleinfo")) {
                        var nome = message.content.slice(10).trim()

                    }
                    else {
                        var nome = message.content.slice(6).trim()
                    }

                    var ruolo = Object.fromEntries(message.guild.roles.cache.filter(ruolo => ruolo.name.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.roles.cache.filter(ruolo => ruolo.name.toLowerCase() == nome.toLowerCase())))[0]];
                }
            }

            if (!ruolo) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Ruolo non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!roleinfo [role]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
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
                .addField(":receipt: Role ID", "```" + ruolo.id + "```", true)
                .addField(":busts_in_silhouette: Members", "```" + memberCount + "```", true)
                .addField(":rainbow: Color", "```" + ruolo.hexColor + "```", true)
                .addField(":pencil: Role created", "```" + ruolo.createdAt.toDateString() + "```", true)
                .addField(":muscle: Permissions", "```" + elencoPermessi + "```", false)

            message.channel.send(embed)

        }
        //AVATAR
        if (message.content.startsWith("!avatar")) {
            if (message.content == "!avatar") {
                var utente = message.member;
            }
            else {
                var utente = message.mentions.members.first()
                if (!utente) { //Per id
                    var args = message.content.split(/\s+/);
                    var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1]))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1])))[0]];
                    if (!utente) { //Per username
                        if (message.content.startsWith("!userstats")) {
                            var nome = message.content.slice(11).trim()
                        }
                        else if (message.content.startsWith("!userinfo")) {
                            var nome = message.content.slice(10).trim()

                        }
                        else {
                            var nome = message.content.slice(6).trim()
                        }
                        var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase())))[0]];
                        if (!utente) { //Per tag
                            var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase())))[0]];
                        }
                    }
                }
            }

            if (!utente) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!avatar [user]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
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
                    description: "**Bannare** un utente permanentemente",
                    alias: ["ban", "bannare"],
                    info: "",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=27"
                },
                kick: {
                    description: "**Espellere** un utente dal server",
                    alias: ["kick", "kickare", "kiccare", "kikkare", "espellere"],
                    info: "",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=27"
                },
                clear: {
                    description: "**Cancellare** un tot di messaggi antecedenti al comando",
                    alias: ["clear", "cancellare", "cancellare messaggi", "clear message"],
                    info: "",
                    video: "https://youtu.be/Cr1yobtZd4c?t=389"
                },
                audio: {
                    description: "Far riprodurre al bot un **file audio**",
                    alias: ["audio", "play", "music", "fileaudio", "file audio", "riprodurre", "riprodurre audio", "riprodurre file audio"],
                    info: "Prima di utilizzare il comando è necessario:\r1. Installare **ffmpeg** sul proprio pc\rPer farlo bisogna scaricare i file da [qui](https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z), estrarre la cartella all'interno del file zip e metterla da qualche parte sul vostro pc, io vi consiglio direttamente nel disco C. Ora sarà necessario aggiungere come variabile d'ambiente il path di questa cartella, per sapere come fare vedere il mio video su YouTube\r2. Installare la libreria **Discord.js Opus**\rPer farlo scrivere nel terminal della cartella del vostro bot: `npm install discord.js @discordjs/opus`",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=374"
                },
                reazione: {
                    description: "Far **reagire** il bot a un messaggio che ha inviato",
                    alias: ["reazione", "react", "reazioni", "reaction", "reactions"],
                    info: "Nelle reazioni non è possibile utilizzare le emoji di Discord ma quelle universali. Puoi ottenerle in diversi modi, cliccando WIN+. oppure andando sul sito [emojipedia.com](https://emojipedia.org/), oppure aggiungendo uno \\ prima di mandare una emoji nella chat di Discord",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=637"
                },
                azioneReazione: {
                    description: "Far eseguire una azione quando un utente **clicca** una reazione",
                    alias: ["azioneReazione", "azione con reazione", "azionereazione", "azione reazione"],
                    info: "Nelle reazioni non è possibile utilizzare le emoji di Discord ma quelle universali. Puoi ottenerle in diversi modi, cliccando WIN+. oppure andando sul sito [emojipedia.com](https://emojipedia.org/), oppure aggiungendo uno \\ prima di mandare una emoji nella chat di Discord",
                    video: "https://youtu.be/x-Ii6BZiVQQ?t=763"
                },
                messaggioPrivato: {
                    description: "Fare mandare al bot un **messaggio privato** a un utente specifico o a chi ha scritto il messaggio",
                    alias: ["messaggioPrivato", "messaggio privato", "messaggioprivato"],
                    info: "",
                    video: "https://youtu.be/SN8b92REkII?t=30"
                },
                taggare: {
                    description: "**Taggare** utenti, ruoli, canali e categorie",
                    alias: ["taggare", "tag", "pin"],
                    info: "",
                    video: ""
                },
                file: {
                    description: "Mandare in allegato qualsiasi **file**",
                    alias: ["file", "mandare file", "mandarefile", "sendfile", "send file", "mandare immagini"],
                    info: "",
                    video: "https://youtu.be/SN8b92REkII?t=311"
                },
                embed: {
                    description: "Realizzare un **messaggio embed**",
                    alias: ["embed", "message embed", "messageembed", "embedmessage", "embed message"],
                    info: "Tutte le proprierà che possiamo settare a un embed sono opzionali, quindi non è necessario aggiungerle tutte ma solo quelle necessarie",
                    video: ""
                },
                random: {
                    description: "Mandare un **messaggio casuale** tra alcuni scelti",
                    alias: ["random", "messaggio random", "testo random"],
                    info: "",
                    video: "https://youtu.be/SN8b92REkII?t=755"
                },
                notifica: {
                    description: "Mandare un **messaggio** a una determinata ora",
                    alias: ["notifica", "messaggio a un ora specifica", "testo random"],
                    info: "",
                    video: "https://youtu.be/SN8b92REkII?t=977"
                },
                soloRuolo: {
                    description: "Fare eseguire un comando solo a utenti che hanno un certo **ruolo**",
                    alias: ["soloRuolo", "soloruolo", "solo ruolo", "comando solo a chi ha un ruolo"],
                    info: "",
                    video: "https://youtu.be/Cr1yobtZd4c?t=14"
                },
                benvenuto: {
                    description: "Messaggio di **benvenuto** o **addio**",
                    alias: ["benvenuto", "addio", "welcome", "messaggio di benvenuto", "messaggio di addio", "welcome message"],
                    info: "Prima di usare il comando, è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione \"Bot\". Attivare le due opzioni in \"Privileged Gateway Intents\" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)",
                    video: "https://youtu.be/Cr1yobtZd4c?t=126"
                },
                userinfo: {
                    description: "Ottenere le informazioni di un **utente specifico**",
                    alias: ["userinfo", "userstats", "user info", "infouser", "info user", "user stats"],
                    info: "",
                    video: "https://youtu.be/FNUIyrRoitg?t=561"
                },
                serverinfo: {
                    description: "Ottenere le informazioni sul **server**",
                    alias: ["serverinfo", "server stats", "server info", "infoserver", "info server", "server stats"],
                    info: "",
                    video: "https://youtu.be/FNUIyrRoitg?t=146"
                },
                memberCounter: {
                    description: "Canale di **statistica membri**",
                    alias: ["membercounter", "member counter", "counter membri"],
                    info: "Prima di creare il comando è necessario creare il canale dove vengono segnati i numeri di membri, potete scegliere nel creare un canale testuale o vocale. Una volta fatto copiare l'id nel codice",
                    video: "https://youtu.be/FNUIyrRoitg?t=19"
                },
                avatar: {
                    description: "Ottenere l'**immagine profilo** di un utente",
                    alias: ["avatar"],
                    info: "",
                    video: ""
                },
                roleinfo: {
                    description: "Ottenere le informazioni su un **ruolo** del server",
                    alias: ["roleinfo", "rolestats", "role info", "role stats"],
                    info: "",
                    video: ""
                },
                canale: {
                    description: "Ottenere un **canale testuale/vocale** (Per magari mandare un messaggio in quel canale specifico)",
                    alias: ["canale", "getcanale", "get canale", "canale specifico"],
                    info: "",
                    video: ""
                },
                level: {
                    description: "Ottenere un **canale testuale/vocale** (Per magari mandare un messaggio in quel canale specifico)",
                    alias: ["livello", "livellamento", "rank", "leaderboard", "lb", "level system", "levelsystem"],
                    info: "Prima di utilizzare questo codice è necessario configurare i database ([Come usare i database](https://youtu.be/6D69VJhVfsY)) creando una tabella Userinfo dove inserire i valori principale con queste tre caselle: id (id dell'utente), username (nome utente dell'utente), level (livello effettivo), xp (esperienza totale), cooldownXp (cooldown dei livellamente, per far contare solo un messaggio al minuto)",
                    video: "https://www.youtube.com/watch?v=t2gaSJp9Lm4"
                }
            }
            var command = message.content.slice(5).trim();
            var data, comando, info, video, description;

            var args = command.split(" ");
            if (args[args.length - 1].toLowerCase() == "here" && utenteMod && args.length != 1) {
                command = command.slice(0, -5)
            }

            if (utenteMod) {
                var utente = message.mentions.members.first()
                if (utente) {
                    command = command.slice(0, -22).trim()
                    if (utente.user.bot) {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Non a un Bot")
                            .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                            .setColor("#8F8F8F")
                            .setDescription("Non puoi mandare codice a un Bot")

                        message.channel.send(embed).then(msg => {
                            message.delete({ timeout: 7000 })
                            msg.delete({ timeout: 7000 })
                        })
                        return
                    }
                }
                if (!utente) {
                    var utente = message.member
                }
            }
            else {
                var utente = message.member
            }


            if (message.content.trim() == "!code") {
                var paginaInziale = new Discord.MessageEmbed()
                    .setTitle("CodeAndCommand")
                    .setDescription("Tutti i codici per tutti i comandi del tuo bot")
                    .addField("❓Come funziona", "Questo comando ti permette di avere accesso a **tutti i codici** o **funzioni** che sono stati affrontati su **GiulioAndCode** da utilizzare nel tuo Bot Discord\rQua c'è l'elenco di tutti i comandi che puoi usare per avere precisamente il comando, la funzione e il suo funzionamente (`!code [comando]`)")
                    .addField("🌐Sezioni", "`🏠Home`\r`🔨Moderazione (Come !ban, !clear, !kick, ecc..)`\r`🧰Utility (Welcome message, !userinfo, !serverinfo, ecc..)`\r`🤣Fun`\r`🔰Altro (Notifiche, Messaggi random, Mandare file, ecc..)`")

                var paginaModerazione = new Discord.MessageEmbed()
                    .setTitle("Moderazione")
                    .setDescription("Qui troverai tutti i comandi relativi alla **moderazione**\rUtilizza il comando `!code` più il nome di uno dei comandi sottostanti per ricevere immediatamente il **codice** e la **spiegazione** (`!code ban`, `!code clear`)")
                    .setColor("#DF8612")
                    .addField("💿Tutti i codici", `
    - \`ban\` **Bannare** un utente permanentemente\r
    - \`kick\` **Espellere** un utente dal server\r
    - \`clear\` **Cancellare** un tot di messaggi antecedenti al comando\r
    ` )

                var paginaUtility = new Discord.MessageEmbed()
                    .setTitle("Utility")
                    .setDescription("Qui troverai tutti i comandi più **utili**\rUtilizza il comando `!code` più il nome di uno dei comandi sottostanti per ricevere immediatamente il **codice** e la **spiegazione** (`!code audio`, `!code file`)")
                    .setColor("#C92F42")
                    .addField("💿Tutti i codici", `
    - \`benvenuto\` Messaggio di **benvenuto** o **addio**\r
    - \`serverinfo\` Ottenere le informazioni sul **server**\r
    - \`userinfo\` Ottenere le informazioni di un **utente specifico**\r
    - \`roleinfo\` Ottenere le informazioni su un **ruolo** del server\r
    - \`avatar\` Ottenere l'**immagine profilo** di un utente\r
    - \`level\` Sistema di livellamento semplice per il server\r
    ` )


                var paginaFunny = new Discord.MessageEmbed()
                    .setTitle("Fun")
                    .setDescription("Qua non c'è ancora nulla mi spiace...")
                    .setColor("#F3C249")

                var paginaAltro = new Discord.MessageEmbed()
                    .setTitle("Altro")
                    .setDescription("Qui troverai tutti altre tipologie di funzioni\rUtilizza il comando `!code` più il nome di uno dei comandi sottostanti per ricevere immediatamente il **codice** e la **spiegazione** (`!code taggare`)")
                    .setColor("#45D8CE")
                    .addField("💿Tutti i codici", `
    - \`audio\` Fare riprodurre al bot un **file audio**\r
    - \`reazione\` Fare **reagire** il bot a un messaggio che ha inviato\r
    - \`messaggioPrivato\` Mandare dal bot un **messaggio privato** a un utente specifico o a chi ha scritto il comando\r
    - \`azioneReazione\` Far eseguire una azione quando un utente **clicca** una reazione\r
    - \`random\` Mandare un **messaggio casuale** tra alcuni scelti\r
    - \`notifica\` Mandare un **messaggio** a una determinata ora\r
    - \`soloRuolo\` Fare eseguire un comando solo a utenti che hanno un certo **ruolo**\r
    - \`taggare\` **Taggare** utenti, ruoli, canali e categorie\r
    - \`file\` Mandare in allegato qualsiasi ** file **\r
    - \`embed\` Realizzare un **messaggio embed**\r
    - \`memberCounter\` Canale di **statistica membri**\r
    - \`canale\` Ottenere un **canale testuale/vocale** (Per magari mandare un messaggio in quel canale specifico)\r
    ` )
                message.delete({ timeout: 120000 })
                message.channel.send(paginaInziale).then(msg => {
                    msg.delete({ timeout: 120000 })
                    msg.react('🏠').then(r => {
                        msg.react('🔨')
                        msg.react('🧰')
                        msg.react('🤣')
                        msg.react('🔰')

                        // Filters
                        const reactHome = (reaction, user) => reaction.emoji.name === '🏠' && user.id === message.author.id
                        const reactMod = (reaction, user) => reaction.emoji.name === '🔨' && user.id === message.author.id
                        const reactUtl = (reaction, user) => reaction.emoji.name === '🧰' && user.id === message.author.id
                        const reactFun = (reaction, user) => reaction.emoji.name === '🤣' && user.id === message.author.id
                        const reactAlt = (reaction, user) => reaction.emoji.name === '🔰' && user.id === message.author.id

                        const paginaHome = msg.createReactionCollector(reactHome)
                        const paginamod = msg.createReactionCollector(reactMod)
                        const paginaUtl = msg.createReactionCollector(reactUtl)
                        const paginaFun = msg.createReactionCollector(reactFun)
                        const paginaAlt = msg.createReactionCollector(reactAlt)

                        paginaHome.on('collect', (r, u) => {
                            msg.edit(paginaInziale)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginamod.on('collect', (r, u) => {
                            msg.edit(paginaModerazione)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaUtl.on('collect', (r, u) => {
                            msg.edit(paginaUtility)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaFun.on('collect', (r, u) => {
                            msg.edit(paginaFunny)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaAlt.on('collect', (r, u) => {
                            msg.edit(paginaAltro)
                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                    })
                })
                return
            }

            //Codici
            var audioComandi = `client.on("message", message => {
            if (message.content == "!audio") {
                const voiceChannel = message.member.voice.channel;
                if (voiceChannel) {
                    voiceChannel.join()
                        .then(connection => {
                            connection.play('audio.mp3'); //Scrivere il nome del file audio nella cartella o il path
                        });
                }
                else {
                    message.channel.send("No voice channel."); //Messaggio se l'utente non è in nessun canale vocale
                }
            }
        })`
            var avatarComandi = `client.on("message", message => {
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
        })`
            var azioneReazioneComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                message.channel.send("ciao").then(messaggio => {
                    messaggio.react('👍');
                    messaggio.react('👎');
        
                    const filtro = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id; //Tra le parentesi quadre inserire tutte le emoji delle reazioni
        
                    messaggio.awaitReactions(filtro, { max: 1, time: 30000 }).then(collected => { //Max = numero massimo di volte che l'utente puo cliccare sulla reazione, Time = tempo limite per cliccare
        
                        var reazione = collected.first().emoji.name;
                        if (reazione == "👍") {
                            message.channel.send("OK"); //Azione che si esegue quando si clicca 👍
                        }
                        if (reazione == "👎") {
                            message.channel.send("NO"); //Azione che si esegue quando si clicca 👎
                        }
                        message.delete(); //Cancellare il comando dell'utente
                        messaggio.delete(); //Cancellare il messaggio del bot
        
                    }).catch(collected => {
                        return message.channel.send("Tempo scaduto"); //Messaggio se il tempo è scaduto (se non è stato inserito un tempo, questa parte non è necessario)
                    });
                })
            }
        })`
            var banComandi = `client.on("message", message => {
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
        })`
            var benvenutoComandi = `//Messaggio di benvenuto
        client.on("guildMemberAdd", (member) => {
            //console.log(member.guild); Per avere tutte le info del server
            client.channels.cache.get("793781905740922900").send("Ciao " + member.toString() + " benvunuto in **" + member.guild.name + "**\rSei il **" + member.guild.memberCount + "° membro**");
        })
        //Messaggio di Addio
        client.on("guildMemberRemove", (member) => {
            client.channels.cache.get("793781905740922900").send("Ciao ciao" + member.toString() + ", torna presto!");
        })`
            var canaleComandi = `var canale = client.channels.cache.get("idCanale");
        canale.send("Messaggio");`
            var clearComandi = `client.on("message", message => {
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
        })`
            var embedComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                const nomeEmbed = new Discord.MessageEmbed()
                    .setColor("#34a454") // Colore principale
                    .setTitle("Titolo") //Titolo
                    .setURL("UrlTitolo") //Link sul titolo
                    .setAuthor("Autore") //Autore (nome, link immagine, link sul nome)
                    .setDescription("Descrizione") //Descrizione
                    .setThumbnail("UrlCopertina") //Copertina
                    //Aggiungere elementi
                    .addField("Titolo", "Contenuto", true / false) //True o false = se questo elemento deve essere in linea con gli altri
                    .setImage("LinkImmagine") //Immagine
                    .setFooter("TestoFooter", "UrlImmagineFooter") // Testo piccolino in fondo
                    .setTimestamp() //Se mettere o no l'orario di arrivo del messaggio
        
                message.channel.send(nomeEmbed)
            }
        })`
            var fileComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                //Per mandare un singolo file
                message.channel.send("File:", { files: ["file.jpeg"] });
                //Per mandare più file alla volta
                message.channel.send("File:", { files: ["file.jpeg", "file2.jpg"] });
            }
        })`
            var kickComandi = `client.on("message", message => {
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
        })`
            var memberCounterComandi = `client.on("guildMemberAdd", member => { //Update canale quando entra un utente dal server
            var canale = client.channels.cache.get("idCanaleCounter")
            canale.setName("👾│members: " + member.guild.memberCount)
        });
        client.on("guildMemberRemove", member => { //Update canale quando esce un utente dal server
            var canale = client.channels.cache.get("idCanaleCounter")
            canale.setName("👾│members: " + member.guild.memberCount)
        });`
            var messaggioPrivatoComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                //Se vuoi mandare il messaggio all'utente che scrive il comando
                message.author.send("Messaggio privato");
        
                //Se vuoi mandare il messaggio a un utente specifico
                var utente = client.users.cache.get("idUtente");
                utente.send("messaggio");
            }
        })`
            var notificaComandi = `//Mettere tutto ciò fuori da tutto, quindi anche fuori dal client.on("message") 
        setInterval(function () {
            var hour = new Date().getHours();
            var minutes = new Date().getMinutes();
        
            if (hour == "18" && minutes == "32") { //Settare l'ora che si vuole, in questo momento viene mandato un messaggio in un canale tutti i giorni alle 18:32
                client.channels.cache.get("idCanale").send("Ciao!");
            }
        }, 1000 * 60)`
            var randomComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                var messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
                var random = Math.floor(Math.random() * messaggi.length);
                message.channel.send(messaggi[random]);
            }
        })`
            var reazioneComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                message.channel.send("Messaggio")
                    .then(function (message) {
                        message.react("👎"); //Aggiungere o togliere tutte le reazioni che si vogliono
                        message.react('🍎');
                        message.react('🍊');
                        message.react('🍇');
                    })
            }
        })`
            var roleinfoComandi = `const { Permissions } = require('discord.js');
    
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
                    .addField("Role ID", ruolo.id, true)
                    .addField("Members", memberCount, true)
                    .addField("Color", ruolo.hexColor, true)
                    .addField("Role created", ruolo.createdAt.toDateString(), true)
                    .addField("Permissions", elencoPermessi, false)
        
                message.channel.send(embed)
            }
        })`
            var serverinfoComandi = `client.on("message", message => {
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
        })`
            var soloRuoloComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                if (message.member.roles.cache.has("idRuolo")) {
                    message.channel.send("Questo utente ha questo ruolo");
                } else {
                    message.channel.send("Questo utente non ha questo ruolo");
                }
            }
        })`
            var taggareComandi = `client.on("message", message => {
            if (message.content == "!comando") {
                //Taggare l'utente che scrive il comando
                message.channel.send(message.author.toString());
                //Taggare un utente specifico
                message.channel.send("<@idUtente>");
                //Taggare un ruolo del server
                message.channel.send("<@&idRuolo>");
                //Taggare un canale o una categoria
                message.channel.send("<#idCanale/Categoria>");
            }
        })
        `
            var userinfoComandi = `client.on("message", message => {
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
                            elencoPermessi += "- " + permessi[i] + "\r";
                        }
                    }
                }
        
                var embed = new Discord.MessageEmbed()
                    .setTitle(utente.user.tag)
                    .setDescription("Tutte le info di questo utente")
                    .setThumbnail(utente.user.avatarURL({dynamic: true}))
                    .addField("User id", utente.user.id, true)
                    .addField("Status", utente.user.presence.status, true)
                    .addField("Is a bot?", utente.user.bot ? "Yes" : "No", true)
            .addField("Account created", utente.user.createdAt.toDateString(), true)
            .addField("Joined this server", utente.joinedAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)
            .addField("Roles", utente.roles.cache.map(ruolo => ruolo.name).join("\r"), false)
    
        message.channel.send(embed)
    }
        })`
            var levelComandi = `var con = mysql.createPool({ //Connessione database Heroku
                connectionLimit: 1000,
                connectTimeout: 60 * 60 * 1000,
                acquireTimeout: 60 * 60 * 1000,
                timeout: 60 * 60 * 1000,
                host: 'eu-cdbr-west-03.cleardb.net',
                port: 3306,
                user: 'usernmame',
                password: "password",
                database: 'database',
                charset: 'utf8mb4'
        })
        
        client.on("message", message => {
                if (message.author.bot) return
                if (message.channel.type == "dm") return
        
                con.query("SELECT * FROM userstats", (err, result) => {
                        var userstatsList = result;
        
                        if (message.content.startsWith("!rank")) {
                                if (message.content == "!rank") {
                                        var utente = message.member;
                                }
                                else {
                                        var utente = message.mentions.members.first()
                                }
        
                                if (!utente) {
                                        message.channel.send("Utente non valido")
                                        return
                                }
        
        
                                var index = userstatsList.findIndex(x => x.id == utente.id);
                                if (index < 0) {
                                        message.channel.send("Questo utente non ha esperienza")
                                        return
                                }
                                var userstats = userstatsList[index]
        
                                var progress = "";
                                var nProgress = parseInt(5 * (userstats.xp - calcoloXpNecessario(userstats.level)) / (calcoloXpNecessario(userstats.level + 1) - calcoloXpNecessario(userstats.level)))
                                for (var i = 0; i < nProgress; i++) {
                                        progress += ":white_medium_small_square:";
                                }
                                for (var i = 0; i < 5 - nProgress; i++) {
                                        progress += ":white_small_square:";
                                }
        
        
                                var embed = new Discord.MessageEmbed()
                                        .setTitle(utente.user.tag)
                                        .setDescription("Il livello di questo utente")
                                        .setThumbnail(utente.user.avatarURL())
                                        .addField("Level " + userstats.level, progress)
        
                                message.channel.send(embed)
                        }
        
                        if (message.content == "!leaderboard") {
                                var leaderboardList = userstatsList.sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))
        
                                var leaderboard = ""
                                for (var i = 0; i < 10; i++) {
                                        if (leaderboardList.length - 1 < i) {
                                                break
                                        }
                                        leaderboard += \`**#\${i + 1}** \${leaderboardList[i].username} - Level \${leaderboardList[i].level}\r\`
                                }
        
                                var embed = new Discord.MessageEmbed()
                                        .setTitle("Leaderboard")
                                        .addField("Classifica livelli", leaderboard)
        
                                message.channel.send(embed)
                        }
        
                        var index = userstatsList.findIndex(x => x.id == message.author.id);
                        if (index < 0) {
                                index = userstatsList.lenght;
        
                                userstatsList[index] = {
                                        id: message.author.id,
                                        username: message.member.user.tag,
                                        xp: 0,
                                        level: 0,
                                        cooldownXp: 0
                                }
        
                                con.query(\`INSERT INTO userstats VALUES ('\${message.author.id}', '\${message.member.user.tag}', 0, 0, 0)\`)
                        }
        
                        var userstats = userstatsList[index]
        
                        if (userstats.cooldownXp <= 0) {
                                userstats.cooldownXp = 60;
                                var xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
                                userstats.xp += xp
        
                                if (userstats.xp >= calcoloXpNecessario(userstats.level + 1)) {
                                        userstats.level++;
        
                                        var canale = client.channels.cache.get("804688929109966848");
                                        canale.send(\`\${message.author.toString()} hai raggiunto il livello \${userstats.level}\`)
                                }
        
                                con.query(\`UPDATE userstats SET level = \${userstats.level}, xp = \${userstats.xp}, cooldownXp = \${userstats.cooldownXp} WHERE id = \${userstats.id}\`)
                        }
                })
        })
        
        function calcoloXpNecessario(level) {
                var xpNecessarioFinoA10 = [0, 70, 250, 370, 550, 840, 1200, 1950, 2500, 3000, 3900]
        
                if (level < 10) {
                        return xpNecessarioFinoA10[level]
                }
                else {
                        return level * level * 50
                }
        }
        
        setInterval(function () {
                con.query("SELECT * FROM userstats", (err, result) => {
                        var userstatsList = result;
        
                        userstatsList.forEach(userstats => {
                                if (userstats.cooldownXp > 0) {
                                        userstats.cooldownXp -= 5
        
                                        con.query(\`UPDATE userstats SET cooldownXp = \${userstats.cooldownXp} WHERE id = \${userstats.id}\`)
                                }
                        })
                })
        }, 5000)
        `
            for (var i = 0; i < Object.keys(comandi).length; i++) {
                for (var x = 0; x < eval("comandi." + Object.keys(comandi)[i]).alias.length; x++) {
                    if (command == eval("comandi." + Object.keys(comandi)[i]).alias[x]) {
                        comando = Object.keys(comandi)[i];
                        info = eval("comandi." + Object.keys(comandi)[i]).info
                        video = eval("comandi." + Object.keys(comandi)[i]).video
                        description = eval("comandi." + Object.keys(comandi)[i]).description
                        break
                    }
                }
            }
            if (!comando) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Codice non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!code (codice)`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }
            else {
                data = eval(comando + "Comandi")

                var embed = new Discord.MessageEmbed()
                    .setTitle(comando.toUpperCase())
                if (video) {
                    embed
                        .setDescription(description + "\rGuarda il video su YouTube per maggiori info ([Clicca qui](" + video + "))");
                }
                else {
                    embed
                        .setDescription(description)
                }

                if (info) {
                    embed
                        .addField(":name_badge: Info", info)
                }


                if (data.length > 1000) {
                    data = data.slice(0, 950);

                    embed
                        .addField(":wrench: Codes:", "```js\r" + data + "```")
                        .addField(":warning: Il codice è troppo lungo", "Per ricevere il codice completo puoi scaricare il file allegato")

                    if (args[args.length - 1].toLowerCase() == "here") {
                        message.channel.send(embed)
                        message.channel.send({ files: ["comandi/" + comando + "-GiulioAndCode.txt"] })
                    }
                    else {
                        utente.send(embed).catch(() => {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("DM non concessi")
                                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                                .setColor("#8F8F8F")
                                .setDescription("Questo utente non può ricevere messaggi privati")

                            message.channel.send(embed).then(msg => {
                                message.delete({ timeout: 7000 })
                                msg.delete({ timeout: 7000 })
                            })
                            return
                        }).then(() => {
                            utente.send({ files: ["comandi/" + comando + "-GiulioAndCode.txt"] })
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Ecco il codice")
                                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                                .setColor("#16A0F4")
                                .setDescription("Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())

                            message.channel.send(embed).then(msg => {
                                message.delete({ timeout: 7000 })
                                msg.delete({ timeout: 7000 })
                            })
                        })
                    }
                }
                else {
                    embed.addField(":wrench: Codes:", "```js\r" + data + "```");
                    if (args[args.length - 1].toLowerCase() == "here") {
                        message.channel.send(embed)
                    }
                    else {
                        utente.send(embed).catch(() => {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("DM non concessi")
                                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                                .setColor("#8F8F8F")
                                .setDescription("Questo utente non può ricevere messaggi privati")

                            message.channel.send(embed).then(msg => {
                                message.delete({ timeout: 7000 })
                                msg.delete({ timeout: 7000 })
                            })
                            return
                        }).then(() => {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Ecco il codice")
                                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                                .setColor("#16A0F4")
                                .setDescription("Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())

                            message.channel.send(embed).then(msg => {
                                message.delete({ timeout: 7000 })
                                msg.delete({ timeout: 7000 })
                            })
                        })



                    }

                }

            }

        }

        //SUGGESTIONS
        if (message.content.startsWith("!sdelete")) {
            if (!utenteMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!sdelete` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var id = message.content.slice(9).trim();
            if (id == "") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire un id")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!sdelete [id]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var suggestions = JSON.parse(serverstats.suggestions);

            if (!suggestions[id]) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Suggerimento non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!sdelete [id]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }
            delete suggestions[id];

            serverstats.suggestions = suggestions
            updateServerstats(serverstats)

            var canale = client.channels.cache.get(canaleSuggestions)
            canale.messages.fetch(id)
                .then(message => {
                    message.delete()
                })

            var embed = new Discord.MessageEmbed()
                .setTitle("Suggerimento eliminato")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .setDescription("Suggestion ID: " + id + " eliminato dalla lista")

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 2000 })
                msg.delete({ timeout: 2000 })
            })
        }

        if (message.content.startsWith("!suggest") || message.content.startsWith("!suggerisci") || message.content.startsWith("!suggerimento")) {
            if (message.content.startsWith("!suggest"))
                var contenuto = message.content.slice(9).trim();
            if (message.content.startsWith("!suggerisci"))
                var contenuto = message.content.slice(12).trim();
            if (message.content.startsWith("!suggerimento"))
                var contenuto = message.content.slice(14).trim();

            if (contenuto == "") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire un suggerimento")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!suggest [suggerimento]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            contenuto = contenuto.replace(/\n/g, ' ');
            contenuto = contenuto.replace(/\"/g, '');
            contenuto = contenuto.replace(/\'/g, '');
            contenuto = contenuto.replace(/\`/g, '');

            var suggestions = JSON.parse(serverstats.suggestions);

            embedSuggestion
                .setTitle("💡Suggestions by " + message.member.user.username)
                .setDescription(contenuto)
                .setThumbnail(message.member.user.avatarURL({ dynamic: true }))

            var canale = client.channels.cache.find(channel => channel.id == canaleSuggestions);

            var embed = new Discord.MessageEmbed()
                .setTitle("Suggerimento inserito")
                .setThumbnail("https://i.postimg.cc/TPTBD4WP/479-4791861-file-twemoji-1f4a1-svg-light-bulb-emoji-twitter.png")
                .setColor("#FED883")
                .setDescription(contenuto)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 7000 })
                msg.delete({ timeout: 7000 })
            })

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

                    serverstats.suggestions = suggestions
                    updateServerstats(serverstats)
                })



        }

        //CHALLENGE
        if (message.content.startsWith("!cdelete")) {
            if (!utenteMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!cdelete` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var challenges = JSON.parse(serverstats.challenges)

            var id = message.content.slice(9).trim();
            if (id == "") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire un id")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!cdelete [id]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            if (!challenges[id]) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Challenge non trovata")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!cdelete [id]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }
            delete challenges[id];

            serverstats.challenges = challenges;
            updateServerstats(serverstats)

            var canale = client.channels.cache.get(canaleChallenge)
            canale.messages.fetch(id)
                .then(message => {
                    message.delete()
                })
            var embed = new Discord.MessageEmbed()
                .setTitle("Challenge eliminata")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .setDescription("Challenge ID: " + id + " eliminata dalla lista")

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 2000 })
                msg.delete({ timeout: 2000 })
            })
        }

        if (message.content.startsWith("!challenge") || message.content.startsWith("!sfida")) {
            if (message.content.startsWith("!challenge"))
                var contenuto = message.content.slice(11).trim();
            if (message.content.startsWith("!sfida"))
                var contenuto = message.content.slice(7).trim();

            if (contenuto == "") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire una challenge")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!challenge [sfida]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            contenuto = contenuto.replace(/\n/g, ' ');
            contenuto = contenuto.replace(/\"/g, '');
            contenuto = contenuto.replace(/\'/g, '');
            contenuto = contenuto.replace(/\`/g, '');

            var challenges = JSON.parse(serverstats.challenges);

            embedChallenge
                .setTitle("🎯 Challenge by " + message.member.user.username)
                .setDescription(contenuto)
                .setThumbnail(message.member.user.avatarURL({ dynamic: true }))

            var canale = client.channels.cache.find(channel => channel.id == canaleChallenge);

            var embed = new Discord.MessageEmbed()
                .setTitle("Challenge inserita")
                .setThumbnail("https://i.postimg.cc/G2xfhJpy/479-4791861-file-twemoji-1f4a1-svg-light-bulb-emoji-twitter.png")
                .setColor("#FFAC33")
                .setDescription(contenuto)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 7000 })
                msg.delete({ timeout: 7000 })
            })

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
                    serverstats.challenges = challenges;
                    updateServerstats(serverstats)
                })
        }

        //TWITCH
        if (message.content.startsWith("!tget")) {
            if (message.member.id != "793768313934577664") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!tget` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var args = message.content.split(/\s+/);
            if (!args[1]) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire il numero di utenti")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!tget [count]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var count = parseInt(args[1])
            if (!count && count != 0) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire un numero valido")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!tget [count]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            if (count <= 0) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Inserire un numero positivo")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!tget [count]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var salaDAttesa = client.channels.cache.get(canaleAttesa);
            var canaleOnLive = client.channels.cache.get(canaleLive);

            var utenti = [];
            var probabilita = [];

            var sommaProbabilità = 0;

            //sottratte tempo di debuff
            // for (var i = 0; i < Object.keys(utentiSceltiPrima).length; i++) {
            //     utentiSceltiPrima[Object.keys(utentiSceltiPrima)[i]].time -= 10;
            //     if (utentiSceltiPrima[Object.keys(utentiSceltiPrima)[i]].time <= 0) {
            //         delete utentiSceltiPrima[Object.keys(utentiSceltiPrima)[i]];
            //     }
            // }


            salaDAttesa.members.forEach(user => {
                var userMod = false;
                for (var i = 0; i < ruoliMod.length; i++) {
                    if (user.roles.cache.has(ruoliMod[i])) userMod = true;
                }

                if (!userMod) {
                    if (utentiSceltiPrima[user.id])
                        var debuff = utentiSceltiPrima[user.id].time
                    else
                        var debuff = 0;

                    utenti.push(user)
                    sommaProbabilità += getRolechance(user, debuff)
                }

            })


            utenti.forEach(user => {
                if (utentiSceltiPrima[user.id])
                    var debuff = utentiSceltiPrima[user.id].time
                else
                    var debuff = 0;

                probabilita.push(getRolechance(user, debuff) / sommaProbabilità)
            })

            if (utenti.length == 0) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non c'è nessuno")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .setDescription("Nessuno vuole entrare in live")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var elencoUtenti = ""
            var elencoProbabilita = ""

            if (utenti.length <= count) {
                for (var i = 0; i < utenti.length; i++) {
                    utenti[i].voice.setChannel(canaleOnLive)
                    elencoUtenti += utenti[i].user.tag + "\r"

                    elencoProbabilita += (probabilita[i] * 100).toFixed(2) + "%\r"

                    if (utentiSceltiPrima[utenti[i].id]) {
                        if (utentiSceltiPrima[utenti[i].id].time >= 30)
                            var tempo = utentiSceltiPrima[utenti[i].id].time + 10
                        else
                            var tempo = 30

                    }
                    else {
                        var tempo = 30
                    }

                    utentiSceltiPrima[utenti[i].id] = {
                        username: utenti[i].user.tag,
                        time: tempo
                    }
                }
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utenti estratti")
                    .setDescription("Tot user: " + utenti.length + "\rUtenti estratti: " + count)
                    .addField("Users", elencoUtenti, true)
                    .addField("Chance", elencoProbabilita, true)
                    .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                    .setColor("#16A0F4")
                message.channel.send(embed)
                return
            }

            var elencoUtenti = ""
            var elencoProbabilita = ""

            var embed = new Discord.MessageEmbed()
                .setTitle("Utenti estratti")
                .setDescription("Tot user: " + utenti.length + "\rUtenti estratti: " + count)
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")

            var utentiScelti = []
            for (var i = 0; i < count; i++) {
                var utenteScelto = getRandom(probabilita, utenti);
                var index = utenti.findIndex(user => user == utenteScelto);

                elencoUtenti += utenteScelto.user.tag + "\r"
                elencoProbabilita += (probabilita[index] * 100).toFixed(2) + "%\r"

                probabilita = Array.from(probabilita).filter((element, id) => id != index);
                utenti = Array.from(utenti).filter((element, id) => id != index);

                utenteScelto.voice.setChannel(canaleOnLive)

                utentiScelti.push(utenteScelto)

                if (utentiSceltiPrima[utenteScelto.id]) {
                    if (utentiSceltiPrima[utenteScelto.id].time >= 30)
                        var tempo = utentiSceltiPrima[utenteScelto.id].time + 10
                    else
                        var tempo = 30
                }
                else {
                    var tempo = 30
                }

                utentiSceltiPrima[utenteScelto.id] = {
                    username: utenteScelto.user.tag,
                    time: tempo
                }
            }
            for (var i = 0; i < Object.keys(utentiSceltiPrima).length; i++) {
                var èSceltoAdesso = false;
                for (var j = 0; j < utentiScelti.length; j++) {
                    if (Object.keys(utentiSceltiPrima)[i] == utentiScelti[j])
                        èSceltoAdesso = true;
                }
                if (!èSceltoAdesso) {
                    utentiSceltiPrima[Object.keys(utentiSceltiPrima)[i]].time -= 10;
                    if (utentiSceltiPrima[Object.keys(utentiSceltiPrima)[i]].time <= 0) {
                        delete utentiSceltiPrima[Object.keys(utentiSceltiPrima)[i]];
                    }
                }

            }

            embed
                .addField("Users", elencoUtenti, true)
                .addField("Chance", elencoProbabilita, true)
            message.channel.send(embed)
        }

        if (message.content == "!tstop" || message.content == "!tend") {
            var salaDAttesa = client.channels.cache.get(canaleAttesa);
            var canaleOnLive = client.channels.cache.get(canaleLive);

            var count = 0;
            canaleOnLive.members.forEach(user => {
                var userMod = false;
                for (var i = 0; i < ruoliMod.length; i++) {
                    if (user.roles.cache.has(ruoliMod[i])) userMod = true;
                }

                if (!userMod) {
                    user.voice.setChannel(salaDAttesa)
                    count++;
                }
            })

            var embed = new Discord.MessageEmbed()
                .setTitle("Utenti spostati")
                .setDescription(count + " utenti spostati in attesa")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
            message.channel.send(embed)
        }

        if (message.content.startsWith("!tkick")) {
            if (!utenteMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!tkick` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var utente = message.mentions.members.first()
            if (!utente) { //Per id
                var args = message.content.split(/\s+/);
                var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1]))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1])))[0]];
                if (!utente) { //Per username

                    var nome = message.content.slice(7).trim()
                    var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase())))[0]];
                    if (!utente) { //Per tag
                        var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase())))[0]];
                    }
                }
            }


            if (!utente) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!tkick [user]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var userMod = false;
            for (var i = 0; i < ruoliMod.length; i++) {
                if (utente.roles.cache.has(ruoliMod[i])) userMod = true;
            }
            if (userMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi kickare questo utente")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var salaDAttesa = client.channels.cache.get(canaleAttesa);

            if (!utente.voice.channel || utente.voice.channel.id != canaleLive) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente non in live")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .setDescription("Questo utente non è nel canale ON LIVE")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            utente.voice.setChannel(salaDAttesa)
            utente.roles.remove(ruoloOnLive)

            var embed = new Discord.MessageEmbed()
                .setAuthor("[TWITCH KICK] " + utente.user.tag, utente.user.avatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/R0KttgKN/Giulio-Ban-copia-3.png")
                .setColor("#6143CB")
                .setDescription(utente.toString() + "è stato kicckato da <#" + canaleLive + ">")

            message.channel.send(embed)

            var embedUtente = new Discord.MessageEmbed()
                .setTitle("Sei stato espulso da Twitch")
                .setColor("#6143CB")
                .setThumbnail("https://i.postimg.cc/R0KttgKN/Giulio-Ban-copia-3.png")
                .setDescription("Sei stato kicckato da <#" + canaleLive + ">, rientra in Sala d'attesa e ritenta di partecipare")

            try {
                utente.send(embedUtente)
            }
            catch {

            }
        }

        if (message.content.startsWith("!tban")) {
            if (!utenteMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!tban` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var utente = message.mentions.members.first()
            if (!utente) { //Per id
                var args = message.content.split(/\s+/);
                var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1]))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1])))[0]];
                if (!utente) { //Per username

                    var nome = message.content.slice(6).trim()
                    var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase())))[0]];
                    if (!utente) { //Per tag
                        var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase())))[0]];
                    }
                }
            }


            if (!utente) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!tban [user]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var userMod = false;
            for (var i = 0; i < ruoliMod.length; i++) {
                if (utente.roles.cache.has(ruoliMod[i])) userMod = true;
            }
            if (userMod) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi bannare questo utente")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var salaDAttesa = client.channels.cache.get(canaleAttesa);

            if (utente.voice.channelID == canaleAttesa || utente.voice.channelID == canaleLive) {
                utente.voice.kick();
            }

            salaDAttesa.overwritePermissions([
                {
                    id: utente.id,
                    deny: ["CONNECT"]
                }
            ]);

            var embed = new Discord.MessageEmbed()
                .setAuthor("[TWITCH BAN] " + utente.user.tag, utente.user.avatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setColor("#6143CB")
                .setDescription(utente.toString() + "è stato bannato da <#" + canaleLive + ">")

            message.channel.send(embed)

            var embedUtente = new Discord.MessageEmbed()
                .setTitle("Sei stato bannato da Twitch")
                .setColor("#6143CB")
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setDescription("Sei stato bannato da <#" + canaleLive + ">, non potrai più partecipare alle live")

            try {
                utente.send(embedUtente)
            }
            catch {

            }
        }

        if (message.content.startsWith("!tunban")) {
            if (!message.member.hasPermission("ADMINISTRATOR")) { //<------------------------- METTERE utentemod
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi eseguire il comando `!tunban` perchè non hai il permesso")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var utente = message.mentions.members.first()
            if (!utente) { //Per id
                var args = message.content.split(/\s+/);
                var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1]))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.id == args[1])))[0]];
                if (!utente) { //Per username

                    var nome = message.content.slice(8).trim()
                    var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.username.toLowerCase() == nome.toLowerCase())))[0]];
                    if (!utente) { //Per tag
                        var utente = Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase()))[Object.keys(Object.fromEntries(message.guild.members.cache.filter(utente => utente.user.tag.toLowerCase() == nome.toLowerCase())))[0]];
                    }
                }
            }


            if (!utente) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente non trovato")
                    .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                    .setColor("#ED1C24")
                    .setDescription("`!tunban [user]`")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }
            var salaDAttesa = client.channels.cache.get(canaleAttesa);

            salaDAttesa.overwritePermissions([
                {
                    id: utente.id,
                    allow: ["CONNECT"]
                }
            ]);

            var embed = new Discord.MessageEmbed()
                .setAuthor("[TWITCH UNBAN] " + utente.user.tag, utente.user.avatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setColor("#6143CB")
                .setDescription(utente.toString() + "è stato sbannato da <#" + canaleLive + ">")

            message.channel.send(embed)

            var embedUtente = new Discord.MessageEmbed()
                .setTitle("Sei stato bannato da Twitch")
                .setColor("#6143CB")
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setDescription("Sei stato sbannato da <#" + canaleLive + ">, ora puoi di nuovo partecipare alle live")

            try {
                utente.send(embedUtente)
            }
            catch {

            }
        }

        if (message.content.startsWith("!tchance")) {
            var salaDAttesa = client.channels.cache.get(canaleAttesa);

            var utenti = [];
            var probabilita = [];

            var sommaProbabilità = 0;

            salaDAttesa.members.forEach(user => {
                var userMod = false;
                for (var i = 0; i < ruoliMod.length; i++) {
                    if (user.roles.cache.has(ruoliMod[i])) userMod = true;
                }

                if (!userMod) {
                    if (utentiSceltiPrima[user.id])
                        var debuff = utentiSceltiPrima[user.id].time
                    else
                        var debuff = 0;

                    utenti.push(user)
                    sommaProbabilità += getRolechance(user, debuff)
                }

            })


            utenti.forEach(user => {
                if (utentiSceltiPrima[user.id])
                    var debuff = utentiSceltiPrima[user.id].time
                else
                    var debuff = 0;

                probabilita.push(getRolechance(user, debuff) / sommaProbabilità)
            })


            if (utenteMod) {
                if (utenti.length == 0) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Non c'è nessuno")
                        .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                        .setColor("#8F8F8F")
                        .setDescription("Nessuno vuole entrare in live")

                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 7000 })
                        msg.delete({ timeout: 7000 })
                    })
                    return
                }

                for (var i = 0; i < utenti.length; i++) {
                    for (var j = 0; i < utenti.length; i++) {
                        if (probabilita[i] > probabilita[j]) {
                            var tmp = probabilita[i];
                            probabilita[i] = probabilita[j];
                            probabilita[j] = tmp;

                            var tmp = utenti[i];
                            utenti[i] = utenti[j];
                            utenti[j] = tmp;
                        }
                    }
                }

                var elencoUtenti = ""
                var elencoProbabilita = ""

                for (var i = 0; i < utenti.length; i++) {
                    elencoUtenti += utenti[i].user.tag + "\r"
                    elencoProbabilita += (probabilita[i] * 100).toFixed(2) + "%\r"
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("Probabilità")
                    .setDescription("Tutti gli utenti con le relative probabilità in Sala d'attesa")
                    .addField("Users", elencoUtenti, true)
                    .addField("Chance", elencoProbabilita, true)
                message.channel.send(embed)
            }
            else {
                if (!message.member.voice || message.member.voice.channelID != canaleAttesa) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Non sei in attesa")
                        .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                        .setColor("#8F8F8F")
                        .setDescription("Per vedere la tua probabilità devi essere nel canale <#" + canaleAttesa + ">")

                    message.channel.send(embed).then(msg => {
                        message.delete({ timeout: 7000 })
                        msg.delete({ timeout: 7000 })
                    })
                    return
                }

                var index = utenti.findIndex(user => user == message.member);

                var embed = new Discord.MessageEmbed()
                    .setTitle("PROBABILITÀ - " + message.member.user.tag)
                    .setThumbnail(message.member.user.avatarURL({ dynamic: true }))
                    .setDescription("La tua probabilità di entrare in live, sali di livello per avere più possibilità")
                    .addField("Chance: " + (probabilita[index] * 100).toFixed(2) + "%", "Utenti totali: " + utenti.length)

                message.channel.send(embed)
            }
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

    })
})

//Counter member + Welcome message
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

    if (member.guild.id != "793776260350083113") return

    var server = member.guild;
    var botCount = server.members.cache.filter(member => member.user.bot).size;
    var utentiCount = server.memberCount - botCount;

    //Counter message
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + utentiCount)

    //Welcome message
    var canale = client.channels.cache.get("793781893904072715")
    canale.send(`
-------------- 𝐍𝐔𝐎𝐕𝐎 𝐌𝐄𝐌𝐁𝐑𝐎 --------------
🤙 Ciao ${member.toString()}, benvenuto in GiulioAndCommunity
👀 Sei il **${utentiCount}° Membro**
📜 Prima di fare altro, leggi le <#793781895829258260>
🚨 Puoi vedere tutte le informazioni sul server in <#793781897619570738>`)
});

client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    if (member.guild.id != "793776260350083113") return

    var server = member.guild;
    var botCount = server.members.cache.filter(member => member.user.bot).size;
    var utentiCount = server.memberCount - botCount;

    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + utentiCount)
});

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.id == "802184359120863272") return

    // fetch message data if we got a partial event
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    con.query("SELECT * FROM serverstats", (err, result) => {
        if (err) {
            console.log(err)
        }
        var serverstats = result[0];
        var suggestions = JSON.parse(serverstats.suggestions);
        var challenges = JSON.parse(serverstats.challenges);

        if (messageReaction.message.channel.id == canaleSuggestions) {
            if (!suggestions.hasOwnProperty(messageReaction.message.id)) return

            if (messageReaction._emoji.name == "😍") {
                if (!suggestions[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                    suggestions[messageReaction.message.id].totVotiPos.push(user.id)
                    serverstats.suggestions = suggestions
                    updateServerstats(serverstats)
                }
                else {
                    messageReaction.users.remove(user);
                }

            }
            else if (messageReaction._emoji.name == "💩") {

                if (!suggestions[messageReaction.message.id].totVotiPos.includes(user.id)) {
                    suggestions[messageReaction.message.id].totVotiNeg.push(user.id)
                    serverstats.suggestions = suggestions
                    updateServerstats(serverstats)

                }
                else {
                    messageReaction.users.remove(user);
                }

            }

            var canale = client.channels.cache.get(canaleSuggestions)
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
        if (messageReaction.message.channel.id == canaleChallenge) {
            if (!challenges.hasOwnProperty(messageReaction.message.id)) return

            if (messageReaction._emoji.name == "👍") {
                if (!challenges[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                    challenges[messageReaction.message.id].totVotiPos.push(user.id)
                    serverstats.challenges = challenges
                    updateServerstats(serverstats)

                }
                else {
                    messageReaction.users.remove(user);
                }

            }
            else if (messageReaction._emoji.name == "👎") {

                if (!challenges[messageReaction.message.id].totVotiPos.includes(user.id)) {
                    challenges[messageReaction.message.id].totVotiNeg.push(user.id)
                    serverstats.challenges = challenges
                    updateServerstats(serverstats)

                }
                else {
                    messageReaction.users.remove(user);
                }

            }

            var canale = client.channels.cache.get(canaleChallenge)
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
    })
})

client.on("messageReactionRemove", async function (messageReaction, user) {
    if (user.id == "802184359120863272") return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    con.query("SELECT * FROM serverstats", (err, result) => {
        if (err) {
            console.log(err)
        }
        var serverstats = result[0];
        var suggestions = JSON.parse(serverstats.suggestions);
        var challenges = JSON.parse(serverstats.challenges);

        if (messageReaction.message.channel.id == canaleSuggestions) {
            var suggestions = JSON.parse(serverstats.suggestions);
            if (!suggestions.hasOwnProperty(messageReaction.message.id)) return
            if (messageReaction._emoji.name == "😍") {


                if (suggestions[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id) < 0) {
                    suggestions[messageReaction.message.id].totVotiPos.splice(suggestions[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id), 1)
                    serverstats.suggestions = suggestions
                    updateServerstats(serverstats)

                }


            }
            else if (messageReaction._emoji.name == "💩") {
                if (suggestions[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id) < 0) {
                    suggestions[messageReaction.message.id].totVotiNeg.splice(suggestions[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id), 1)
                    serverstats.suggestions = suggestions
                    updateServerstats(serverstats)

                }

            }


            var canale = client.channels.cache.get(canaleSuggestions)
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
        if (messageReaction.message.channel.id == canaleChallenge) {
            if (!challenges.hasOwnProperty(messageReaction.message.id)) return
            if (messageReaction._emoji.name == "👍") {

                if (challenges[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id) < 0) {
                    challenges[messageReaction.message.id].totVotiPos.splice(challenges[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id), 1)
                    serverstats.challenges = challenges
                    updateServerstats(serverstats)

                }


            }
            else if (messageReaction._emoji.name == "👎") {
                if (challenges[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id) < 0) {
                    challenges[messageReaction.message.id].totVotiNeg.splice(challenges[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id), 1)
                    serverstats.challenges = challenges
                    updateServerstats(serverstats)

                }

            }


            var canale = client.channels.cache.get(canaleChallenge)
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
    })
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;

    //KICK FROM #member-counter e #subscriber
    if (newUserChannel == "800802386587287562" || newUserChannel == "801717800137129994") {
        var server = client.guilds.cache.get(idServer);
        var utente = server.members.cache.find(x => x.id == newMember.id);
        utente.voice.kick()
    }


    if (oldUserChannel == canaleLive && newUserChannel != canaleLive && oldMember.id == "793768313934577664") {
        var salaDAttesa = client.channels.cache.get(canaleAttesa);
        var canaleOnLive = client.channels.cache.get(canaleLive);
        salaDAttesa.members.forEach(user => {
            user.voice.kick()
        })
        canaleOnLive.members.forEach(user => {
            user.voice.kick()
        })
    }

    if (newUserChannel == canaleAttesa && oldUserChannel != canaleAttesa && oldUserChannel != canaleLive) {
        var server = client.guilds.cache.get(idServer);
        var Giulio = server.members.cache.find(x => x.id == "793768313934577664");

        if (Giulio.voice.channelID != canaleLive && newUserChannel == canaleAttesa) {
            var utente = server.members.cache.find(x => x.id == newMember.id);

            var embed = new Discord.MessageEmbed()
                .setTitle("Giulio non è in live")
                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                .setColor("#8F8F8F")
                .setDescription("Sei entrato in sala d'attesa ma Giulio non è ancora nella stanza <#" + canaleLive + ">")
            try {
                utente.send(embed)
            }
            catch {

            }
            utente.voice.kick()
            return
        }
        else {
            var server = client.guilds.cache.get(idServer);
            var utente = server.members.cache.find(x => x.id == newMember.id);

            var salaDAttesa = client.channels.cache.get(canaleAttesa);

            var utenti = [];
            var probabilita = [];

            var sommaProbabilità = 0;

            salaDAttesa.members.forEach(user => {
                var userMod = false;
                for (var i = 0; i < ruoliMod.length; i++) {
                    if (user.roles.cache.has(ruoliMod[i])) userMod = true;
                }

                if (!userMod) {
                    if (utentiSceltiPrima[user.id])
                        var debuff = utentiSceltiPrima[user.id].time
                    else
                        var debuff = 0;

                    utenti.push(user)
                    sommaProbabilità += getRolechance(user, debuff)
                }

            })

            utenti.forEach(user => {
                if (utentiSceltiPrima[user.id])
                    var debuff = utentiSceltiPrima[user.id].time
                else
                    var debuff = 0;

                probabilita.push(getRolechance(user, debuff) / sommaProbabilità)
            })

            var index = utenti.findIndex(user => user == newMember.id);

            var embed = new Discord.MessageEmbed()
                .setTitle("Sei in attesa")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .setDescription("Grazie per essere entrato in sala d'attesa, attendi la prossima estrazione per entrare in live\r\r**Probabilità attuale: " + (probabilita[index] * 100).toFixed(2) + "%**")
                .setFooter("Fai il comando !tchance per sapere sempre la tua probabilità di entrare in live")

            try {
                utente.send(embed)
            }
            catch {

            }
        }
    }

    if (newUserChannel == canaleLive && oldUserChannel != canaleLive && oldUserChannel != canaleGeneral) {
        var server = client.guilds.cache.get(idServer);
        var utente = server.members.cache.find(x => x.id == oldMember.id);
        var ruolo = server.roles.cache.get(ruoloOnLive);

        var server = client.guilds.cache.get(idServer);
        var Giulio = server.members.cache.find(x => x.id == "793768313934577664");

        var utenteMod = false;
        for (var i = 0; i < ruoliMod.length; i++) {
            if (utente.roles.cache.has(ruoliMod[i])) utenteMod = true;
        }

        if (utenteMod) {
            utente.roles.add(ruolo)
            return
        }

        try {
            utente.send(`
        :four_leaf_clover: **SEI STATO SCELTO** :four_leaf_clover: 
Complimenti, sei stato scelto tra gli utenti in Sala d'attesa. Prima di entrare in live leggi queste **regole**:

:red_circle: **REGOLE**
- Utilizzare un **linguaggio non volgare** e un linguaggio civile (no discriminazioni)
- Non bestemmiare
- Rispettare Giulio, i Mod e tutti gli utenti presenti in live

:purple_circle: **PRINCIPALI REGOLE DI TWITCH**
- Sono vietati contenuti o attività che mostrino, incoraggino, offrano o inducano **comportamenti illegali**
- Sono vietate tutte le attività che potrebbero mettere in pericolo la tua **vita **o causarti **danni fisici**
- Twitch non consente la presenza di contenuti che raffigurino, celebrino, incoraggino o sostengono il **terrorismo**, o individui e atti estremisti violenti
- Su Twitch non sono consentiti comportamenti volti all'**odio** e **molestie** (discriminazioni, denigrazioni, molestie o violenze basate sulle seguenti caratteristiche protette)
- Sei tenuto a non violare la **riservatezza** delle altre persone
- Sono proibiti contenuti e attività che possono interrompere, danneggiare, o altrimenti violare l'integrità dei **servizi di Twitch**, oppure l'esperienza o i dispositivi di un altro utente
- Sono vietati i contenuti e le attività **sessualmente espliciti**
- Durante i **giochi online** con più utenti, sono proibiti imbrogli, azioni di pirateria informatica, utilizzo di bot, o manomissioni che costituiscano un vantaggio indebito per il proprietario dell'account
Per maggiori informazioni: <https://www.twitch.tv/p/it-it/legal/community-guidelines/>

P.S. Consiglio di non tenere l'audio della live attivo quando siete presenti su discord, Giulio terrà la webcam attiva con l'output della live, in modo che voi utenti possiate vedere la diretta senza ritardo

:green_circle: **ACCETTA LE REGOLE**
Clicca sulla **reazione **per accettare le regole sopra elencate, in caso contrario si verrà sanzionati con la non riammissione nelle live future`)
                .then(messaggio => {
                    messaggio.react('✅');

                    const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id == utente.id;

                    const collector = messaggio.createReactionCollector(filter, { max: 1, time: 120000 })

                    collector.on('collect', (reaction, user) => {
                        if (reaction._emoji.name == '✅') {
                            var server = client.guilds.cache.get(idServer);
                            var utente = server.members.cache.find(x => x.id == user.id);
                            var ruolo = server.roles.cache.get(ruoloOnLive);

                            if (!utente.voice.channel || utente.voice.channel.id != canaleLive) {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle("Non sei più in live")
                                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                                    .setColor("#8F8F8F")
                                    .setDescription("Sei uscito dal canale <#" + canaleLive + "> quindi aspetta la prossima estrazione per entrare")

                                utente.send(embed)
                            }
                            else {
                                var canaleOnLive = server.channels.cache.find(x => x == canaleLive);
                                var general = server.channels.cache.find(x => x == canaleGeneral);

                                utente.voice.setChannel(general).then(() => {
                                    utente.roles.add(ruolo)
                                        .then(() => {
                                            utente.voice.setChannel(canaleOnLive)
                                            var embed = new Discord.MessageEmbed()
                                                .setTitle("Sei in live")
                                                .setThumbnail("https://i.postimg.cc/pTLyx7yV/On-air-acceso.png")
                                                .setColor("#543C84")
                                                .setDescription("Rispetta tutte le regole, e mantieni un atteggiamento civile")

                                            utente.send(embed)
                                        })
                                })
                            }
                        }
                    })
                })
        } catch {

        }
    }

    if (oldUserChannel == canaleLive && newUserChannel != canaleLive) {
        var server = client.guilds.cache.get(idServer);
        var utente = server.members.cache.find(x => x.id == oldMember.id);

        var ruolo = server.roles.cache.get(ruoloOnLive);
        utente.roles.remove(ruolo) //Add ruolo ON LIVE

        var userMod = false;
        for (var i = 0; i < ruoliMod.length; i++) {
            if (utente.roles.cache.has(ruoliMod[i])) userMod = true;
        }

        if (!userMod && utente.roles.cache.has(ruoloOnLive)) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Grazie per essere stato in live")
                .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                .setColor("#16A0F4")
                .setDescription("Torna presto per poter essere riestratto")

            try {

                utente.send(embed)
            }
            catch {

            }
        }


    }
})

//Counter youtube
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get("801717800137129994")
        canale.setName("🎬│subscribers: " + response.subscriberCount)
    })
}, 1000 * 10)

function updateServerstats(serverstats) {
    if (typeof serverstats.challenges === 'string' || serverstats.challenges instanceof String)
        serverstats.challenges = JSON.parse(serverstats.challenges)
    if (typeof serverstats.suggestions === 'string' || serverstats.suggestions instanceof String)
        serverstats.suggestions = JSON.parse(serverstats.suggestions)
    if (typeof serverstats.tempmute === 'string' || serverstats.tempmute instanceof String)
        serverstats.tempmute = JSON.parse(serverstats.tempmute)
    if (typeof serverstats.tempban === 'string' || serverstats.tempban instanceof String)
        serverstats.tempban = JSON.parse(serverstats.tempban)

    con.query(`UPDATE serverstats SET numero = ${serverstats.numero}, ultimoUtente = '${serverstats.ultimoUtente}', bestScore = ${serverstats.bestScore}, timeBestScore = ${serverstats.timeBestScore}, suggestions = '${JSON.stringify(serverstats.suggestions)}', challenges = '${JSON.stringify(serverstats.challenges)}', tempmute = '${JSON.stringify(serverstats.tempmute)}', tempban = '${JSON.stringify(serverstats.tempban)}'`, (err) => {
        if (err) {
            console.log(err)
            return
        }
    })
}

//Twitch
function getRolechance(user, debuff) {
    var chanceBoost = 0;
    for (var i = 0; i < user._roles.length; i++) {
        if (user._roles[i] == "800009879371644940") {
            chanceBoost += 25
        }
        if (user._roles[i] == "807684294587711545") {
            chanceBoost += 20
        }
    }

    for (var i = 0; i < user._roles.length; i++) {
        switch (user._roles[i]) {
            case "799990260393443338": {
                return (5 + chanceBoost) - (debuff * (5 + chanceBoost) / 100)
            }
            case "799990705216159791": {
                return (10 + chanceBoost) - (debuff * (10 + chanceBoost) / 100)
            }
            case "799990735839559690": {
                return (15 + chanceBoost) - (debuff * (15 + chanceBoost) / 100)
            }
            case "799990773708750878": {
                return (20 + chanceBoost) - (debuff * (20 + chanceBoost) / 100)
            }
            case "799990806357213194": {
                return (25 + chanceBoost) - (debuff * (25 + chanceBoost) / 100)
            }
            case "799990832224272405": {
                return (30 + chanceBoost) - (debuff * (30 + chanceBoost) / 100)
            }
            case "799990865001971722": {
                return (35 + chanceBoost) - (debuff * (35 + chanceBoost) / 100)
            }
            case "799990896849977344": {
                return (40 + chanceBoost) - (debuff * (40 + chanceBoost) / 100)
            }
            case "800740423999815710": {
                return (45 + chanceBoost) - (debuff * (45 + chanceBoost) / 100)
            }
            case "800740473437945927": {
                return (50 + chanceBoost) - (debuff * (50 + chanceBoost) / 100)
            }
            case "800740873351462932": {
                return (65 + chanceBoost) - (debuff * (65 + chanceBoost) / 100)
            }
        }
    }
    return (2 + chanceBoost) - (debuff * (2 + chanceBoost) / 100)
}
function getRandom(probabilita, utenti) {
    var num = Math.random(),
        s = 0,
        lastIndex = probabilita.length - 1;

    for (var i = 0; i < lastIndex; ++i) {
        s += probabilita[i];
        if (num < s) {
            return utenti[i];
        }
    }

    return utenti[probabilita.length - 1];
};