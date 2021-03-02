const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const moment = require('moment');
const Parser = require('expr-eval').Parser;
const ytch = require('yt-channel-info');
const { Permissions } = require('discord.js');
const fs = require("file-system");
const mysql = require('mysql');
const ytnotifier = require('youtube-notifier');
client.login(process.env.token);

client.on("ready", () => {
    console.log("------------ONLINE------------")
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
    password: "924316b9faef8e8",
    database: 'heroku_e1befae4f922504',
    charset: 'utf8mb4'
})

var canaleSuggestions = "793781902728495104";
var embedSuggestion = new Discord.MessageEmbed()

var canaleChallenge = "815611596042666034";
var embedChallenge = new Discord.MessageEmbed()

client.on("message", (message) => {
    if (message.author.bot) return
    if (message.channel.type == "dm") return

    if (message.channel.id == "793781901688963104" && !message.content.startsWith("!suggest")) {
        message.delete({ timeout: 1000 })
    }
    if (message.channel.id == "815611328022315028" && !message.content.startsWith("!challenge")) {
        message.delete({ timeout: 1000 })
    }

    //CANCELLARE COMANDO IN CANALE SBAGLIATO
    var BOT = {
        mee6: {
            comandi: ["!ban", "!tempban", "!clear", "!nfractions", "!kick", "!mute", "!tempmute", "!slowmode", "!unban", "!unmute", "!warm"],
            id: "159985870458322944",
            canaliPermessi: ["801019779480944660"]
        },
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
        arcane: {
            comandi: ["+leaderboard", "+rank", "+level", "+rewards", "+userinfo", "+serverinfo"],
            id: "437808476106784770",
            canaliPermessi: ["801019779480944660"]
        },
        suggester: {
            comandi: [".suggest"],
            id: "564426594144354315",
            canaliPermessi: ["793781901688963104"]
        },
        carlBot: {
            comandi: ["?aesthetics", "?clap", "?double", "?clap", "?fancy", "?fraktur", "?smallcaps", "?clap", "?double"],
            id: "235148962103951360",
            canaliPermessi: ["801019779480944660"]
        },
        couting: {
            comandi: ["c!server", "c!cs", "c!slb", "c!user"],
            id: "510016054391734273",
            canaliPermessi: ["801019779480944660", "793781899796938802"]
        },
        dankMemer: {
            comandi: ["pls"],
            id: "270904126974590976",
            canaliPermessi: ["800040259983376414"]
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
        "-!code": ["801019779480944660"],
        "!serverinfo": ["801019779480944660"],
        "!serverstats": ["801019779480944660"],
        "-!userinfo": ["801019779480944660"],
        "-!userstats": ["801019779480944660"],
        "-!roleinfo": ["801019779480944660"],
        "-!rolestats": ["801019779480944660"],
        "-!avatarinfo": ["801019779480944660"],
        "!youtube": ["801019779480944660"],
        "!lastvideo": ["801019779480944660"],
        "!github": ["801019779480944660"],
        "-!cuser": ["801019779480944660", "793781899796938802"],
        "-!cserver": ["801019779480944660", "793781899796938802"],
        "-!suggest": ["793781901688963104"],
        "-!sdelete": [],
        "-!challenge": ["815611328022315028"],
        "-!cdelete": [],
    }

    var trovato = false;
    var nomeComando;

    for (var i = 0; i < Object.keys(BOT).length; i++) {
        for (var x = 0; x < eval("BOT." + Object.keys(BOT)[0]).comandi.length; x++) {
            if (message.content.startsWith(eval("BOT." + Object.keys(BOT)[i]).comandi[x])) {
                if (!eval("BOT." + Object.keys(BOT)[i]).canaliPermessi.includes(message.channel.id)) {
                    trovato = true;
                }
            }
        }
    }


    if (!trovato) {
        for (var i = 0; i < Object.keys(comandiGiulioAndCommunityBot).length; i++) {
            if (Object.keys(comandiGiulioAndCommunityBot)[i][0] == "-") {
                if (message.content.startsWith(Object.keys(comandiGiulioAndCommunityBot)[i].slice(1))) {
                    trovato = true;
                    nomeComando = Object.keys(comandiGiulioAndCommunityBot)[i]
                    if (message.content.length != Object.keys(comandiGiulioAndCommunityBot)[i].length - 1) {
                        if (message.content.slice(Object.keys(comandiGiulioAndCommunityBot)[i].length - 1)[0] != " ") {
                            trovato = false;
                        }
                    }
                }
            }
            else {
                if (message.content == Object.keys(comandiGiulioAndCommunityBot)[i]) {
                    trovato = true;
                    nomeComando = Object.keys(comandiGiulioAndCommunityBot)[i]

                }
            }
        }
    }

    var canaleNotConcesso = false;
    if (trovato) { //Comando esistente
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

            if (!canaliAdmin.includes(message.channel.id) && !(message.member.hasPermission("ADMINISTRATOR") && message.content.startsWith("!code"))) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Canale non concesso")
                    .setThumbnail("https://i.postimg.cc/857H22km/Canale-non-conceso.png")
                    .setColor("#F15A24")
                    .setDescription("Non puoi utilizzare il comando `" + nomeComando + "` in questo canale")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }
        }
    }
    else {
        if (message.content.startsWith("!")) {
            //Comando non esistente
            var embed = new Discord.MessageEmbed()
                .setTitle("Comando non eistente")
                .setThumbnail("https://i.postimg.cc/MZj5dJFW/Not-found.png")
                .setColor("#FF931E")
                .setDescription("Il comando `" + message.content + "` non esiste")

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 7000 })
                msg.delete({ timeout: 7000 })
            })
            return
        }
    }

    message.content = message.content.trim().toLowerCase();


    //TEST
    if (message.content == "!test") {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
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
        message.channel.send("FUNZIONA TUTTO! Forse...")
    }
    //YOUTUBE
    if (message.content == "!youtube") {
        ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
            var youtube = new Discord.MessageEmbed()
                .setTitle("GiulioAndCode")
                .setColor("#41A9F6")
                .setURL(response.authorUrl)
                .setDescription(":love_you_gesture: Questo è il canale youtube **GiulioAndCode**\rIscriviti, lascia like, e attiva la campanellina")
                .setThumbnail(response.authorThumbnails[2].url)
            message.channel.send(youtube);
        })
    }
    //LAST VIDEO
    if (message.content == "!lastvideo") {
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
    //GITHUB
    if (message.content == "!github") {
        var embed = new Discord.MessageEmbed()
            .setTitle("GITHUB")
            .setDescription("Questo è il link per tutto il codice di <@802184359120863272>\n\n:point_right: https://github.com/GiulioPaesani/GiulioAndCommunityBOT")
            .setThumbnail("https://i.postimg.cc/mrXPWCHK/Senza-titolo-1.jpg")

        message.channel.send(embed)
    }
    //SERVERINFO
    if (message.content == "!server" || message.content == "!serverinfo" || message.content == "!serverstats") {
        var server = message.member.guild;
        var botCount = server.members.cache.filter(member => member.user.bot).size
        var memberCount = server.memberCount - botCount;

        var categoryCount = server.channels.cache.filter(c => c.type == "category").size;
        var textCount = server.channels.cache.filter(c => c.type == "text").size;
        var vocalCount = server.channels.cache.filter(c => c.type == "voice").size;

        var serverStats = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le statistiche su questo server")
            .setThumbnail(server.iconURL())
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
    if (message.content.startsWith("!userinfo") || message.content.startsWith("!userstats")) {
        if (message.content.trim() == "!userinfo" || message.content.trim() == "!userstats" || message.content.trim() == "!user") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first()
        }
        if (!utente) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Sintassi comando errata")
                .setThumbnail("https://i.postimg.cc/zB4j8xVZ/Error.png")
                .setColor("#ED1C24")
                .setDescription("Utente non trovato\r`!userinfo [user]`")

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 7000 })
                msg.delete({ timeout: 7000 })
            })
            return
        }

        var elencoRuoli = "";
        var ruoli = utente._roles;
        for (var i = 0; i < ruoli.length; i++) {
            var ruolo = message.guild.roles.cache.find(role => role.id == ruoli[i]);
            elencoRuoli += "- " + ruolo.name + "\r";
            if (i == 2 && ruoli.length != 3) {
                elencoRuoli += "[Altri " + (ruoli.length - i - 1) + "...]";
                i = ruoli.length + 1;
            }
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
        var userStats = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("Tutte le statistiche su questo utente")
            .setThumbnail(utente.user.avatarURL())
            .addField(":receipt: User ID", "```" + utente.user.id + "```", true)
            .addField(":ok_hand: Status", "```" + status + "```", true)
            .addField(":robot: Is a bot", utente.user.bot ? "```Yes```" : "```No```", true)
            .addField(":pencil: Account created", "```" + utente.user.createdAt.toDateString() + "```", true)
            .addField(":red_car: Joined this server", "```" + new Date(utente.joinedTimestamp).toDateString() + "```", true)
            .addField(":shirt: Roles", "```" + elencoRuoli + "```", false)
            .addField(":muscle: Permissions", "```" + elencoPermessi + "```", false)
        message.channel.send(userStats)
    }
    //ROLEINFO
    if (message.content.trim().startsWith("!roleinfo")) {
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
            .addField("Role ID", "```" + ruolo.id + "```", true)
            .addField("Members", "```" + memberCount + "```", true)
            .addField("Color", "```" + ruolo.hexColor + "```", true)
            .addField("Role created", "```" + ruolo.createdAt.toDateString() + "```", true)
            .addField("Permissions", "```" + elencoPermessi + "```", false)

        message.channel.send(embed)

    }
    //AVATAR
    if (message.content.trim().startsWith("!avatar")) {
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
            }
        }
        var command = message.content.slice(5).trim();
        var data, comando, info, video, description;

        var args = command.split(" ");
        if (args[args.length - 1].toLowerCase() == "here" && message.member.hasPermission("ADMINISTRATOR") && args.length != 1) {
            command = command.slice(0, -5)
        }

        if (message.member.hasPermission("ADMINISTRATOR")) {
            var utente = message.mentions.members.first()
            if (utente) {
                command = command.slice(0, -22).trim()
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

            message.channel.send(paginaInziale).then(msg => {
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
                .setTitle(":interrobang: Non trovato")
                .setDescription(message.member.toString() + " `" + command + "` è un codice che non esiste o non è stato ancora aggiunto\rScrivi `!code` per sapere quali sono i comandi disponibili")
                .setColor("#f23b38")
            message.channel.send(embed).then(msg => {
                msg.delete({ timeout: 5000 });
                message.delete({ timeout: 5000 })
            })
        }
        else {
            data = fs.readFileSync("comandi/" + comando + "-GiulioAndCode.txt")

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
                        message.channel.send(":no_entry_sign: Questo utente non può ricevere DM")
                        return
                    });
                    utente.send({ files: ["comandi/" + comando + "-GiulioAndCode.txt"] })
                    message.channel.send("Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())
                        .then(msg => {
                            msg.delete({ timeout: 5000 })
                        })
                    message.delete({ timeout: 5000 })
                }
            }
            else {
                embed.addField(":wrench: Codes:", "```js\r" + data + "```");
                if (args[args.length - 1].toLowerCase() == "here") {
                    message.channel.send(embed).catch(() => {
                        message.channel.send(":no_entry_sign: Questo utente non può ricevere DM")
                        return
                    });
                }
                else {
                    utente.send(embed).catch(() => {
                        message.channel.send(":no_entry_sign: Questo utente non può ricevere DM")
                        return
                    });
                    message.channel.send("Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())
                        .then(msg => {
                            msg.delete({ timeout: 5000 })
                        })
                    message.delete({ timeout: 5000 })

                }

            }

        }

    }

    var canaleCounting = "793781899796938802";

    if (message.channel == canaleCounting || message.content.startsWith("!cserver") || message.content.startsWith("!cuser") || message.content.startsWith("!sdelete") || message.content.startsWith("!cdelete") || message.content.startsWith("!suggest") || message.content.startsWith("!challenge")) {
        var serverstats, userstats, userstatsList;
        con.query(`select * from serverstats`, function (err, result, fields) {
            if (err) {
                console.log(err);
                return
            }
            serverstats = result[0]; //Get serverstats

            con.query(`select * from userstats`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    return
                }
                userstatsList = result; //Get all userinfo

                var suggestions = JSON.parse(serverstats.suggestions);
                var challenges = JSON.parse(serverstats.challenges);

                //SUGGESTIONS
                if (message.content.startsWith("!sdelete")) {
                    if (!message.member.hasPermission("ADMINISTRATOR")) {
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
                        message.channel.send("Non hai inserito l'id del suggerimento da eliminare")
                            .then(msg => {
                                message.delete({ timeout: 5000 })
                                msg.delete({ timeout: 5000 })
                            })
                        return
                    }

                    if (!suggestions[id]) {
                        message.channel.send("Suggerimento non trovato")
                            .then(msg => {
                                message.delete({ timeout: 5000 })
                                msg.delete({ timeout: 5000 })
                            })
                        return
                    }
                    delete suggestions[id];
                    updateServerstats(suggestions)
                    var canale = client.channels.cache.get(canaleSuggestions)
                    canale.messages.fetch(id)
                        .then(message => {
                            message.delete()
                        })
                    message.channel.send("Suggerimento eliminato con successo")
                        .then(msg => {
                            message.delete({ timeout: 5000 })
                            msg.delete({ timeout: 5000 })
                        })
                }

                if (message.content.startsWith("!suggest")) {
                    var contenuto = message.content.slice(9);

                    if (contenuto == "") {
                        message.channel.send("Non hai inserito un suggerimento")
                            .then(msg => {
                                message.delete({ timeout: 5000 })
                                msg.delete({ timeout: 5000 })
                            })
                        return
                    }

                    embedSuggestion
                        .setTitle("💡Suggestions by " + message.member.user.username)
                        .setDescription(contenuto)
                        .setThumbnail(message.member.user.avatarURL())

                    var canale = client.channels.cache.find(channel => channel.id == canaleSuggestions);

                    var embed = new Discord.MessageEmbed()
                        .setTitle("💡Nuovo suggerimento inserito")
                        .setDescription(contenuto)

                    message.channel.send(embed)
                        .then(msg => {
                            message.delete({ timeout: 5000 })
                            msg.delete({ timeout: 5000 })
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
                            updateServerstats(suggestions)


                        })



                }

                //CHALLENGE
                if (message.content.startsWith("!cdelete")) {
                    if (!message.member.hasPermission("ADMINISTRATOR")) {
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

                    var id = message.content.slice(9).trim();
                    if (id == "") {
                        message.channel.send("Non hai inserito l'id della challenge da eliminare")
                            .then(msg => {
                                message.delete({ timeout: 5000 })
                                msg.delete({ timeout: 5000 })
                            })
                        return
                    }

                    if (!challenges[id]) {
                        message.channel.send("Challenge non trovata")
                            .then(msg => {
                                message.delete({ timeout: 5000 })
                                msg.delete({ timeout: 5000 })
                            })
                        return
                    }
                    delete challenges[id];
                    updateServerstats2(challenges)
                    var canale = client.channels.cache.get(canaleChallenge)
                    canale.messages.fetch(id)
                        .then(message => {
                            message.delete()
                        })
                    message.channel.send("Challenge eliminata con successo")
                        .then(msg => {
                            message.delete({ timeout: 5000 })
                            msg.delete({ timeout: 5000 })
                        })
                }

                if (message.content.startsWith("!challenge")) {
                    var contenuto = message.content.slice(11);

                    if (contenuto == "") {
                        message.channel.send("Non hai inserito una sfida")
                            .then(msg => {
                                message.delete({ timeout: 5000 })
                                msg.delete({ timeout: 5000 })
                            })
                        return
                    }

                    embedChallenge
                        .setTitle("🎯 Challenge by " + message.member.user.username)
                        .setDescription(contenuto)
                        .setThumbnail(message.member.user.avatarURL())

                    var canale = client.channels.cache.find(channel => channel.id == canaleChallenge);

                    var embed = new Discord.MessageEmbed()
                        .setTitle("🎯 Nuova challenge inserita")
                        .setDescription(contenuto)

                    message.channel.send(embed)
                        .then(msg => {
                            message.delete({ timeout: 5000 })
                            msg.delete({ timeout: 5000 })
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
                            updateServerstats2(challenges)
                        })
                }

                //COUNTING
                if (message.channel == canaleCounting) {

                    try {
                        var numero = Parser.evaluate(message.content); //Get numero scritto o risultato espressione

                        var index = userstatsList.findIndex(x => x.id == message.author.id);
                        if (index < 0) { //Se questo utente non c'è nel database
                            userstatsList[userstatsList.length] = {
                                id: message.author.id,
                                username: message.member.user.tag,
                                lastScore: 0,
                                bestScore: 0,
                                timeBestScore: 0,
                                timeLastScore: 0,
                                correct: 0,
                                incorrect: 0
                            }

                            var index = userstatsList.findIndex(x => x.id == message.author.id);
                            userstats = userstatsList[index];

                            //Aggiungere nuovo utente nel database
                            con.query(`INSERT INTO userstats VALUES (${message.author.id}, '${message.member.user.tag}', 0, 0, 0, 0, 0, 0)`, function (err, result, fields) {
                                if (err) {
                                    console.log(err);
                                    return
                                }
                            })
                        }
                        else {
                            userstats = userstatsList[index];
                        }


                    }
                    catch {
                        return //Stringa o valori/espressioni non compresibili
                    }

                    if (message.author.id == serverstats.ultimoUtente) { //Se giocato lo stesso utente piu volte
                        var titleRandom = ["MA SAPETE COME SI GIOCA?", "MA È COSÌ DIFFICILE QUESTO GIOCO?", "NOOOO, PERCHÈ..."]
                        var embed = new Discord.MessageEmbed()
                            .setColor("#EB3140")
                            .setDescription("Ogni utente può scrivere un solo numero alla volta")
                        embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                        message.channel.send(embed)

                        userstats.incorrect = userstats.incorrect + 1;
                        serverstats = {
                            numero: 0,
                            ultimoUtente: "NessunUtente",
                            bestScore: serverstats.bestScore,
                            timeBestScore: serverstats.timeBestScore
                        }

                        message.react("🔴");
                    }
                    else if (numero - 1 != serverstats.numero) { //Numero sbagliato
                        var embed = new Discord.MessageEmbed()
                            .setColor("#EB3140")
                            .setDescription("Numero errato, dovevi inserire `" + (serverstats.numero + 1) + "`")

                        if (serverstats.numero == 0) {
                            var titleRandom = ["RIUSCIAMO A COMINCIARE ALMENO?", "DAI... ALMENO ARRIVIAMO A 10", "NON SO SE LO SAI MA IL PRIMO NUMERO È 1"]
                            embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                        }
                        else if (serverstats.numero <= 10) {
                            embed.setTitle(`FORTUNA CHE ERAVAMO SOLO A ${serverstats.numero}`)
                        }
                        else if (serverstats.numero <= 30) {
                            embed.setTitle(`MA SIETE SICURI DI SAPER CONTARE?`)
                        }
                        else if (serverstats.numero <= 50) {
                            var titleRandom = ["NOOOO, PERCHÈ...", "MEGLIO SE TORNATE A PROGRAMMARE", "PROPRIO ORA DOVEVATE SBAGLIARE?", "DAIII, STAVAMO FACENDO IL RECORD", message.member.user.username + " HAI ROVINATO I SOGNI DI TUTTI"]
                            embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                        }
                        else {
                            var titleRandom = ["IMMAGINO AVRETE 5 IN MATEMATICA, GIUSTO?", "MEGLIO SE TORNATE A PROGRAMMARE", "SIETE DELLE CAPRE"]
                            embed.setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                        }
                        message.channel.send(embed)

                        userstats.incorrect = userstats.incorrect + 1;
                        serverstats = {
                            numero: 0,
                            ultimoUtente: "NessunUtente",
                            bestScore: serverstats.bestScore,
                            timeBestScore: serverstats.timeBestScore
                        }

                        message.react("🔴");
                    }
                    else { //Numero corretto
                        numero >= serverstats.bestScore ? message.react("🔵") : message.react("🟢")
                        numero >= serverstats.bestScore ? serverstats.timeBestScore = new Date().getTime().toString() : serverstats.timeBestScore;
                        serverstats.numero = serverstats.numero + 1;
                        serverstats.ultimoUtente = message.author.id
                        serverstats.bestScore = numero > serverstats.bestScore ? serverstats.bestScore = numero : serverstats.bestScore

                        userstats = {
                            "username": message.member.user.tag,
                            "lastScore": numero,
                            "timeBestScore": numero > userstats.bestScore ? new Date().getTime() : userstats.timeBestScore,
                            "timeLastScore": new Date().getTime(),
                            "bestScore": numero > userstats.bestScore ? userstats.bestScore = numero : userstats.bestScore,
                            "correct": userstats.correct + 1,
                            "incorrect": userstats.incorrect,
                        }

                    }
                    updateDatabase(userstats, serverstats)

                }

                if (message.content.startsWith("!cuser") || message.content.startsWith("!cuser")) {
                    if (message.content.trim() == "!cuser" || message.content.trim() == "!cuser") {
                        var utente = message.member;
                    }
                    else {
                        var utente = message.mentions.members.first()
                    }
                    if (!utente) {
                        message.channel.send(":no_entry_sign: Non ho trovato questo utente")
                            .then(msg => {
                                msg.delete({ timeout: 5000 })
                                message.delete({ timeout: 5000 })
                            })
                        return
                    }

                    var index = userstatsList.findIndex(x => x.id == utente.user.id);
                    if (index < 0) { //Se questo utente non c'è nel database
                        message.channel.send(":x: Questo utente non ha mai giocato a Counting")
                            .then(msg => {
                                msg.delete({ timeout: 5000 })
                                message.delete({ timeout: 5000 })
                            })
                        return
                    }

                    userstats = userstatsList[index];

                    var leaderboard = userstatsList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
                    var position = leaderboard.findIndex(x => x.id == utente.user.id) + 1

                    if (err) console.log(err);
                    if (!err && Object.keys(result).length > 0) {
                        var position = result.findIndex(x => x.id == utente.user.id) + 1
                    }

                    var embed = new Discord.MessageEmbed()
                        .setTitle("COUNTING - " + utente.user.tag)
                        .setDescription("Tutte le statistiche di **counting** su questo utente")
                        .setThumbnail(utente.user.avatarURL())
                        .addField(":trophy: Best score", "```" + userstats.bestScore + " (" + moment(new Date(parseInt(userstats.timeBestScore))).fromNow() + ")```", true)
                        .addField(":chart_with_upwards_trend: Rank", "```#" + position + "```", true)
                        .addField(":medal: Last score", "```" + userstats.lastScore + " (" + moment(new Date(parseInt(userstats.timeLastScore))).fromNow() + ")```", true)
                        .addField(":white_check_mark: Total correct", "```" + userstats.correct + "```", true)
                        .addField(":x: Total incorrect", "```" + userstats.incorrect + "```", true)

                    message.channel.send(embed)
                }

                if (message.content == "!cserver" || message.content == "!cserver") {

                    var leaderboardBestScoreList = userstatsList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))

                    var leaderboardBestScore = "";
                    var utente;
                    for (var i = 0; i < 10; i++) {
                        if (leaderboardBestScoreList.length - 1 < i) {
                            break
                        }

                        utente = leaderboardBestScoreList[i].username.slice(0, -5);
                        switch (i) {
                            case 0:
                                leaderboardBestScore += ":first_place: ";
                                break
                            case 1:
                                leaderboardBestScore += ":second_place: "
                                break
                            case 2:
                                leaderboardBestScore += ":third_place: "
                                break
                            default:
                                leaderboardBestScore += "**#" + (i + 1) + "** "


                        }
                        leaderboardBestScore += utente + " - **" + leaderboardBestScoreList[i].bestScore + "**\r";
                    }

                    var leaderboardCorrectList = userstatsList.sort((a, b) => (a.correct < b.correct) ? 1 : ((b.correct < a.correct) ? -1 : 0))
                    var leaderboardCorrect = "";
                    for (var i = 0; i < 10; i++) {
                        if (leaderboardCorrectList.length - 1 < i) {
                            break
                        }
                        var utente = leaderboardCorrectList[i].username.slice(0, -5);
                        switch (i) {
                            case 0:
                                leaderboardCorrect += ":first_place: ";
                                break
                            case 1:
                                leaderboardCorrect += ":second_place: "
                                break
                            case 2:
                                leaderboardCorrect += ":third_place: "
                                break
                            default:
                                leaderboardCorrect += "**#" + (i + 1) + "** "


                        }
                        leaderboardCorrect += utente + " - **" + leaderboardCorrectList[i].correct + "**\r";
                    }

                    var embed = new Discord.MessageEmbed()
                        .setTitle("COUNTING - GiulioAndCommunity")
                        .setThumbnail(message.member.guild.iconURL())
                        .setDescription("La classifica del server su **counting**")
                        .addField(":1234: Current Number", "```" + serverstats.numero + "```", true)
                        .addField(":medal: Last user", serverstats.ultimoUtente != "NessunUtente" ? "```" + client.users.cache.find(u => u.id == serverstats.ultimoUtente).username + "```" : "```None```", true)
                        .addField(":trophy: Best score", "```" + serverstats.bestScore + " - " + client.users.cache.find(u => u.id == leaderboardBestScoreList[0].id).username + " (" + moment(parseInt(serverstats.timeBestScore)).fromNow() + ")```", false)
                        .addField("Leaderboard (by Best Score)", leaderboardBestScore, true)
                        .addField("Leaderboard (by Correct)", leaderboardCorrect, true)

                    message.channel.send(embed)


                }

            })
        })
        function updateDatabase(userstats, serverstats) {
            con.query(`UPDATE serverstats SET numero = ${serverstats.numero}, ultimoUtente = "${serverstats.ultimoUtente}", bestScore = ${serverstats.bestScore}, timeBestScore = ${serverstats.timeBestScore}`, function (err, result, fields) {
                if (err) {
                    console.log(err)
                }
            })

            con.query(`UPDATE userstats SET id = ${message.author.id}, username = "${message.member.user.tag}", lastScore = ${userstats.lastScore}, bestScore = ${userstats.bestScore}, timeBestScore = ${userstats.timeBestScore}, correct = ${userstats.correct}, incorrect = ${userstats.incorrect}, timeLastScore = ${userstats.timeLastScore} WHERE id = ${message.author.id};`, function (err, result, fields) {
                if (err) {
                    console.log(err)
                }
            })
        }
    }


})

client.on("messageDelete", message => {
    try {
        var numero = Parser.evaluate(message.content);

        if (message.channel == "793781899796938802") {

            var serverstats;
            con.query(`select * from serverstats`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    return
                }
                serverstats = result[0]; //Get serverstats


                if (numero < serverstats.numero) {
                    return
                }

                if (numero != serverstats.numero) { //Se giocato lo stesso utente piu volte
                    return
                }



                var titleRandom = ["PENSAVI DI FREGARMI EH!", "TE LO ELIMINI E IO LO RISCRIVO...", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
                var embed = new Discord.MessageEmbed()
                    .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
                    .setDescription(message.author.toString() + " ha eliminato il numero `" + numero + "`")
                    .setColor("#148eff");

                message.channel.send(embed)

                message.channel.send(numero)
                    .then(msg => {
                        msg.react("🟢");
                    })
            })
        }
    } catch {
        return
    }
})

//Counter member + Welcome message
client.on("guildMemberAdd", member => {
    if (member.user.bot) return

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
  🚨 Poi vedere tutte le informazioni sul server in <#793781897619570738>`)
});

client.on("guildMemberRemove", member => {
    if (member.user.bot) return

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

    con.query("SELECT * FROM serverstats", function (err, result) {
        if (err) {
            console.log(err)
        }

        if (messageReaction.message.channel.id == canaleSuggestions) {
            var suggestions = JSON.parse(result[0].suggestions);
            if (!suggestions.hasOwnProperty(messageReaction.message.id)) return

            if (messageReaction._emoji.name == "😍") {
                if (!suggestions[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                    suggestions[messageReaction.message.id].totVotiPos.push(user.id)
                    updateServerstats(suggestions)
                }
                else {
                    messageReaction.users.remove(user);
                }

            }
            else if (messageReaction._emoji.name == "💩") {

                if (!suggestions[messageReaction.message.id].totVotiPos.includes(user.id)) {
                    suggestions[messageReaction.message.id].totVotiNeg.push(user.id)
                    updateServerstats(suggestions)
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
                        .setThumbnail(client.users.cache.get(suggestions[messageReaction.message.id].user).avatarURL())
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
            var challenges = JSON.parse(result[0].challenges);
            if (!challenges.hasOwnProperty(messageReaction.message.id)) return

            if (messageReaction._emoji.name == "👍") {
                if (!challenges[messageReaction.message.id].totVotiNeg.includes(user.id)) {
                    challenges[messageReaction.message.id].totVotiPos.push(user.id)
                    updateServerstats2(challenges)
                }
                else {
                    messageReaction.users.remove(user);
                }

            }
            else if (messageReaction._emoji.name == "👎") {

                if (!challenges[messageReaction.message.id].totVotiPos.includes(user.id)) {
                    challenges[messageReaction.message.id].totVotiNeg.push(user.id)
                    updateServerstats2(challenges)
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
                        .setThumbnail(client.users.cache.get(challenges[messageReaction.message.id].user).avatarURL())
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
    // fetch message data if we got a partial event
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    con.query("SELECT * FROM serverstats", function (err, result) {
        if (err) {
            console.log(err)
        }

        if (messageReaction.message.channel.id == canaleSuggestions) {
            var suggestions = JSON.parse(result[0].suggestions);
            if (!suggestions.hasOwnProperty(messageReaction.message.id)) return
            if (messageReaction._emoji.name == "😍") {


                if (suggestions[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id) < 0) {
                    suggestions[messageReaction.message.id].totVotiPos.splice(suggestions[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id), 1)
                    updateServerstats(suggestions)
                }


            }
            else if (messageReaction._emoji.name == "💩") {
                if (suggestions[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id) < 0) {
                    suggestions[messageReaction.message.id].totVotiNeg.splice(suggestions[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id), 1)
                    updateServerstats(suggestions)
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
                        .setThumbnail(client.users.cache.get(suggestions[messageReaction.message.id].user).avatarURL())
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
            var challenges = JSON.parse(result[0].challenges);
            if (!challenges.hasOwnProperty(messageReaction.message.id)) return
            if (messageReaction._emoji.name == "👍") {

                if (challenges[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id) < 0) {
                    challenges[messageReaction.message.id].totVotiPos.splice(challenges[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id), 1)
                    updateServerstats2(challenges)
                }


            }
            else if (messageReaction._emoji.name == "👎") {
                if (challenges[messageReaction.message.id].totVotiPos.findIndex(x => x == user.id) < 0) {
                    challenges[messageReaction.message.id].totVotiNeg.splice(challenges[messageReaction.message.id].totVotiNeg.findIndex(x => x == user.id), 1)
                    updateServerstats2(challenges)
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
                        .setThumbnail(client.users.cache.get(challenges[messageReaction.message.id].user).avatarURL())
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

function updateServerstats(suggestions) {
    con.query("UPDATE serverstats SET suggestions = '" + JSON.stringify(suggestions) + "'", function (err) {
        if (err) {
            console.log(err)
            return
        }
    })
}
function updateServerstats2(challenges) {
    con.query("UPDATE serverstats SET challenges = '" + JSON.stringify(challenges) + "'", function (err) {
        if (err) {
            console.log(err)
            return
        }
    })
}

//Counter youtube
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get("801717800137129994")
        canale.setName("🎬│subscribers: " + response.subscriberCount)
    })
}, 1000 * 10)

//YOUTUBE NOTIFICATION
/*
const Notifier = new ytnotifier({
    channels: ['UCK6QwAdGWOWN9AT1_UQFGtA'],
    checkInterval: 30
});

Notifier.on('video', video => {
    var canale = client.channels.cache.get("793781905740922900");

    var data = new Date(video.publishDate);

    const channelId = 'UC6WJ32r35demIRvxV-xDU2g' //<--- DA CAMBIARE
    const sortBy = 'newest'
    ytch.getChannelVideos(channelId, sortBy).then((response) => {
        var embed = new Discord.MessageEmbed()
            .setTitle(":film_frames: NEW VIDEO :film_frames:")
            .setColor("#41A9F6")
            .setDescription("È uscito un nuovo video su **GiulioAndCommunity**, vai subito a vederlo...\r :point_right: " + video.url)
            .setImage(response.items[0].videoThumbnails[3].url)
            .addField(":film_frames: Duration", "```" + response.items[0].durationText + "```", true)
            .addField(":alarm_clock: Published", "```" + data.toDateString() + " " + (data.getHours() + 1) + ":" + data.getMinutes() + "```", true)

        canale.send(embed)
    })

    canale.send("<@&801109543035207752>").then(msg => {
        msg.delete({ timeout: 5000 })
    })

});
*/

/*
const express = require('express')
const app = express()
var xml2js = require('xml2js');

var parser = new xml2js.Parser();
const YouTubeNotifier = require('youtube-notification');

const notifier = new YouTubeNotifier({
    hubCallback: 'https://example.com/youtube',
    port: 8080,
    secret: 'Something',
    path: '/youtube'
});
notifier.setup();

notifier.on('notified', data => {
    console.log(data);
    client.channels.cache.get("793781905740922900").send("Sei qualcuno sta leggendo questo vuol dire che sta funzionando tutto, spero...    ")
    client.channels.cache.get("793781905740922900").send(
        `${data.channel.name} just uploaded a new video titled: ${data.video.title}`);
});

notifier.subscribe('UCYZ3uwiIy1LrwrAywLeQSlQ');*/