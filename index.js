const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("file-system")
const ytch = require('yt-channel-info')
client.login(process.env.token);

client.on("ready", () => {
    console.log("------------ONLINE------------")
})


//CANCELLARE COMANDO IN CANALE SBAGLIATO
client.on("message", (message) => {
    if (message.content.startsWith("!code")) {
        return
    }

    var BOT = {
        giulioAndCommunityBot: {
            comandi: ["!serverinfo", "!serverstas", "!userinfo", "!userstats", "!youtube", "!lastvideo"],
            id: "802184359120863272",
            canaliPermessi: ["801019779480944660"]
        },
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

    var canaleNonConcesso = new Discord.MessageEmbed()
        .setTitle(":no_entry_sign: Canale non concesso :no_entry_sign: ")
        .setColor("ff0000")

    if (message.author.bot) return;

    var trovato = false;
    var id;
    for (var i = 0; i < Object.keys(BOT).length; i++) {
        for (var x = 0; x < eval("BOT." + Object.keys(BOT)[0]).comandi.length; x++) {
            if (message.content.startsWith(eval("BOT." + Object.keys(BOT)[i]).comandi[x])) {
                if (!eval("BOT." + Object.keys(BOT)[i]).canaliPermessi.includes(message.channel.id)) {
                    id = eval("BOT." + Object.keys(BOT)[i]).id;
                    trovato = true;
                }
            }
        }
    }
    if (message.member.hasPermission("ADMINISTRATOR")) {
        return
    }

    if (trovato) {
        canaleNonConcesso.setDescription(message.author.toString() + " non puoi utilizzare i comandi di <@" + id + "> in questo canale!");
        message.channel.send(canaleNonConcesso)
            .then(msg => {
                msg.delete({ timeout: 5000 })
            })
        message.delete({ timeout: 5000 })
        return
    }
})

//Counter member
client.on("guildMemberAdd", member => {
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + member.guild.memberCount)
});
client.on("guildMemberRemove", member => {
    var canale = client.channels.cache.get("800802386587287562")
    canale.setName("👾│members: " + member.guild.memberCount)
});

//Counter youtube
setInterval(function () {
    ytch.getChannelInfo("UCK6QwAdGWOWN9AT1_UQFGtA").then((response) => {
        var canale = client.channels.cache.get("801717800137129994")
        canale.setName("🎬│subscribers: " + response.subscriberCount)
    })
}, 1000 * 10)

client.on("message", message => {
    /*if (message.channel != "801019779480944660" && message.channel != "793781905740922900" && message.channel != "793781906478858269") {
        return
    }*/

    message.content = message.content.trim().toLowerCase();

    if (!message.content.startsWith("!code")) {
        return
    }

    //TEST
    if (message.content == "!test") {
        message.channel.send("FUNZIONA TUTTO!")
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
    //SERVERINFO
    if (message.content == "!serverinfo" || message.content == "!serverstats") {
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
        if (message.content.trim() == "!userinfo" || message.content.trim() == "!userstats") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first()
        }
        if (!utente) {
            message.channel.send("Non ho trovato questo utente")
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
        }
    }
    if (message.content.startsWith("!code")) {
        var command = message.content.slice(5).trim();
        var data, comando, info, video, description;

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
                .addField("🌐Sezioni", "`🏠Home`\r`🔨Moderazione (Come come !ban, !clear, !kick, ecc..)`\r`🧰Utility (Come mandare un file, notifiche, embed, ecc..)`\r`🤣Fun`\r`🔰Altro (Come taggare un ruolo, ecc..)`")

            var paginaModerazione = new Discord.MessageEmbed()
                .setTitle("Moderazione")
                .setDescription("Qui troverai tutti i comandi relativi alla **moderazione**\rUtilizza il comando `!code` più il nome di uno dei comandi sottostanti per ricevere immediatamente il **codice** e la **spiegazione** (`!code ban`, `!code clear`)")
                .setColor("#DF8612")
                .addField("ban", "- **Bannare** un utente permanentemente")
                .addField("kick", "- **Espellere** un utente dal server")
                .addField("clear", "- **Cancellare** un tot di messaggi antecedenti al comando")

            var paginaUtility = new Discord.MessageEmbed()
                .setTitle("Utility")
                .setDescription("Qui troverai tutti i comandi più **utili**\rUtilizza il comando `!code` più il nome di uno dei comandi sottostanti per ricevere immediatamente il **codice** e la **spiegazione** (`!code audio`, `!code file`)")
                .setColor("#C92F42")
                .addField("audio", "- Far riprodurre al bot un **file audio**")
                .addField("reazione", "- Far **reagire** il bot a un messaggio che ha inviato")
                .addField("messaggioPrivato", "- Fare mandare al bot un **messaggio privato** a un utente specifico o a chi ha scritto il messaggio")
                .addField("file", "- Mandare in allegato qualsiasi **file**")
                .addField("azioneReazione", "- Far eseguire una azione quando un utente **clicca** una reazione")
                .addField("embed", "- Realizzare un **messaggio embed**")
                .addField("random", "- Mandare un **messaggio casuale** tra alcuni scelti")
                .addField("notifica", "- Mandare un **messaggio** a una determinata ora")
                .addField("soloRuolo", "- Fare eseguire un comando solo a utenti che hanno un certo **ruolo**")
                .addField("benvenuto", "- Messaggio di **benvenuto** o **addio**")


            var paginaFunny = new Discord.MessageEmbed()
                .setTitle("Fun")
                .setDescription("Qua non c'è ancora nulla mi spiace...")
                .setColor("#F3C249")

            var paginaAltro = new Discord.MessageEmbed()
                .setTitle("Altro")
                .setDescription("Qui troverai tutti altre tipologie di comandi\rUtilizza il comando `!code` più il nome di uno dei comandi sottostanti per ricevere immediatamente il **codice** e la **spiegazione** (`!code taggare`)")
                .setColor("#45D8CE")
                .addField("taggare", "- **Taggare** utenti, ruoli, canali e categorie")

            message.channel.send(paginaInziale).then(msg => {
                msg.delete({ timeout: 60000 })
                message.delete({ timeout: 60000 })
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
            data = fs.readFileSync("comandi/" + comando + "-GiulioAndCode.js")

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

                utente.send(embed).catch(() => message.channel.send(":no_entry_sign: Questo utente non può ricevere DM").then(msg => msg.delete({ timeout: 5000 })));
                utente.send({ files: ["comandi/" + comando + "-GiulioAndCode.js"] })
                message.channel.send("Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString()).then(msg => msg.delete({ timeout: 5000 }))
                message.delete({ timeout: 5000 })
            }
            else {
                embed.addField(":wrench: Codes:", "```js\r" + data + "```");

                utente.send(embed).catch(() => message.channel.send(":no_entry_sign: Questo utente non può ricevere DM").then(msg => msg.delete({ timeout: 5000 })));
                message.channel.send("Il comando **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString()).then(msg => msg.delete({ timeout: 5000 }))
                message.delete({ timeout: 5000 })
            }

        }

    }
})
