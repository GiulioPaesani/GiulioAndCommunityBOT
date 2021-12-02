module.exports = {
    name: "code",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let command = args.join(" ")
        let data, info, video, description;

        if (args[args.length - 1] == "here" && (utenteMod(message.member) || (message.member.roles.cache.has(config.idRuoloAiutante) || message.member.roles.cache.has(config.idRuoloAiutanteInProva))) && args.length != 1)
            command = command.slice(0, -5)
        else {
            var day = new Date().getDate()
            var month = new Date().getMonth()

            if (month == 11 || (month == 0 && day <= 6)) {
                if (serverstats.avvento[message.author.id])
                    if (serverstats.avvento[message.author.id][2] && args[args.length - 1] == "here")
                        command = command.slice(0, -5)
            }
        }

        if (utenteMod(message.member) || (message.member.roles.cache.has(config.idRuoloAiutante) || message.member.roles.cache.has(config.idRuoloAiutanteInProva))) {
            var utente = message.mentions.members.first()
            if (utente) {
                command = command.slice(0, -22).trim()
                if (utente.user.bot) {
                    warning(message, "Non a un Bot", "Non puoi mandare codice a un Bot")
                    return
                }
            }
            if (!utente)
                var utente = message.member
        }
        else
            var utente = message.member

        if (message.content == "!code") {
            let paginaInziale = new Discord.MessageEmbed()
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

            let paginaModerazione = new Discord.MessageEmbed()
                .setTitle("Moderazione")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#DF8612")
                .addField("**- Ban** _(ban, bannare)_", "Bannare permanentemente un utente dal server")
                .addField("**- Tempban** _(tempban)_", "Bannare temporaneamente un utente dal server, per poi essere sbannato")
                .addField("**- Tempmute** _(tempmute)_", "Mutare temporaneamente un utente dal server, per poi essere smutato")
                .addField("**- Kick** _(kick, kickare, kikkare, espellere)_", "Espellere un utente dal server")
                .addField("**- Clear** _(clear, eliminaremessaggi, delete, deletemessage)_", "Eliminare un tot di messaggi precedenti al command")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaComandi = new Discord.MessageEmbed()
                .setTitle("Comandi vari")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#5A8BB0")
                .addField("**- Serverinfo** _(serverinfo, serverstats)_", "Ottenere le statistiche del proprio server")
                .addField("**- Userinfo** _(userinfo, userstats)_", "Ottenere le statistiche di un utente")
                .addField("**- Roleinfo** _(roleinfo, rolestats)_", "Ottenere le statistiche di un ruolo")
                .addField("**- Channelinfo** _(channelinfo, channelstats)_", "Ottenere le statistiche di un canale")
                .addField("**- Avatar** _(avatar, profilo, immagineprofilo)_", "Ottenere l'immagine profilo di un utente")
                .addField("**- Say** _(say)_", "Far scrivere al bot un qualunche messaggio")
                .addField("**- Lastvideo YouTube** _(lastvideo, ultimovideo)_", "Ottenere l'ultimo video uscito su un canale YouTube")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaUtility = new Discord.MessageEmbed()
                .setTitle("Utility")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#D25365")
                .addField("**- Embed a pagine** _(pagine, embedpagine, pagineembed)_", "Creare un embed con diverse reazioni, che cliccandoli cambiano il contenuto del messaggio")
                .addField("**- Messaggio/Embed random** _(random, messaggiorandom, randommessage, randomembed_", "Far scrivere al bot un messaggio o un embed randomico tra alcuni scelti")
                .addField("**- Notifica** _(notifica)_", "Far inviare al bot un messaggio a una determinata ora tutti i giorni")
                .addField("**- Taggare utenti/ruoli/canali/categorie** _(taggare, tag)_", "Come taggare utenti, ruoli, canali e categorie")
                .addField("**- Dare/Rimuovere ruoli** _(ruoli, dareruolo, rimuovereruolo)_", "Come dare o rimuovere un ruolo specifico all'utente")
                .addField("**- Embed** _(embed)_", "Come realizzare un messaggio embed perfetto in tutti i suoi parametri")
                .addField("**- Solo a chi ha un ruolo** _(soloruolo)_", "Far eseguire un command/funzione solo a chi ha uno o più ruoli")
                .addField("**- Solo a chi ha un permesso** _(solopermesso, permesso)_", "Far eseguire un command/funzione solo a chi ha uno o più permessi")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaFun = new Discord.MessageEmbed()
                .setTitle("#Fun")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("F1C048")
                .addField("**- Counting** _(counting)_", "Piccolo giochino di counting")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaGestione = new Discord.MessageEmbed()
                .setTitle("Gestione messaggi/canali")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#53A9E9")
                .addField("**- Modificare un messaggio** _(modificare, editmessage, edit)_", "Modificare il contenuto di un messaggio appena inviato o inviato in passato")
                .addField("**- Cancellare un messaggio** _(cancellare, deletemessage, delete)_", "Cancellare il command o il messaggio del bot")
                .addField("**- Creare un canale** _(crearecanale, createcanale, createchannel)_", "Creare un canale con nome, permessi e topic")
                .addField("**- Cancellare un canale** _(cancellarecanale, deletecanale, deletechannel)_", "Cancellare un canale")
                .addField("**- Modificare il nome di un canale** _(nomecanale, cambiarenome)_", "Modificare il nome di un canale")
                .addField("**- Sistema di ticket** _(ticket, ticketsystem)_", "Sistema di ticket, con relativi comandi, senza database")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaWelcome = new Discord.MessageEmbed()
                .setTitle("Welcome")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#F9CD58")
                .addField("**- Welcome/Goodbye message** _(welcome, goodbye, benvenuto, addio)_", "Messaggio di benvenuto e addio quando un utente entra/esce dal server")
                .addField("**- Ruolo a chi entra** _(ruoloachientra, welcomeruolo)_", "Dare un ruolo a chi entra nel server")
                .addField("**- Member counter** _(membercouter, canalecounter)_", "Creare un canale con il numero di membri nel server")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaBot = new Discord.MessageEmbed()
                .setTitle("Bot")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#3E80B4")
                .addField("**- Stato bot** _(stato, statobot, status, statusbot)_", "Settare lo stato del proprio bot (Es. Sta giocando a !help)")
                .setFooter("I codici sono quelli tra parentesi")

            let paginaErrori = new Discord.MessageEmbed()
                .setTitle("Errori comuni")
                .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [codice]` utilizzando il codice che trovi a fianco a ogni funzione\rÈ possibile utilizzare tutti i codici tra parentesi per ogni comando\r\r**:hammer: Tutti i codici**")
                .setColor("#BB2F41")
                .addField("**- MaxListenersExceededWarning** _(eventemitter, maxlisteners, error1, errore1)_", "Possible EventEmitter memory leak detected. 11 message listeners added to [Client]. Use emitter.setMaxListeners() to increase limit")
                .setFooter("I codici sono quelli tra parentesi")

            message.channel.send(paginaInziale).then(msg => {
                message.delete({ timeout: 120000 })
                    .catch(() => { })
                msg.delete({ timeout: 120000 })
                    .catch(() => { })
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

        if (!client.codes.has(command) && !client.codes.find(cmd => cmd.aliases && cmd.aliases.includes(command))) {
            error(message, "Codice non trovato", "`!code (codice)`")
            return
        }

        let codice = client.codes.get(command) || client.codes.find(cmd => cmd.aliases && cmd.aliases.includes(command));

        description = codice.description;
        info = codice.info;
        video = codice.video;
        data = codice.code;

        let embed = new Discord.MessageEmbed()
            .setTitle(command.toUpperCase())

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
                var attachment = new Discord.MessageAttachment(Buffer.from(codice.code, 'utf-8'), command + "-GiulioAndCode.txt");
                message.channel.send({ files: [attachment] })
            }
            else {
                utente.send(embed)
                    .then(() => {
                        var attachment = new Discord.MessageAttachment(Buffer.from(codice.code, 'utf-8'), command + "-GiulioAndCode.txt")
                        utente.send({ files: [attachment] })
                        correct(message, "Ecco il codice", "Il command **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())
                    })
                    .catch(() => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("DM non concessi")
                            .setThumbnail(`https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png`)
                            .setColor(`#8F8F8F`)
                            .setDescription("Questo utente non può ricevere **messaggi privati**\rAttiva questa opzione in **Impostazioni utente > Privacy e Sicurezza**")
                            .setImage("https://i.postimg.cc/PJ1GVqmc/attiva-Messaggi-Privati.gif")

                        message.channel.send(embed).then(msg => {
                            message.delete({ timeout: 10000 })
                                .catch(() => { })
                            msg.delete({ timeout: 10000 })
                                .catch(() => { })
                        })
                        return
                    })
            }
        }
        else {
            embed.addField(":wrench: Code:", "```js\r" + data + "```");
            if (args[args.length - 1].toLowerCase() == "here")
                message.channel.send(embed)
            else {
                utente.send(embed)
                    .then(() => {
                        correct(message, "Ecco il codice", "Il command **" + command.toUpperCase() + "** è stato mandato in privato a " + utente.toString())
                    })
                    .catch(() => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("DM non concessi")
                            .setThumbnail(`https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png`)
                            .setColor(`#8F8F8F`)
                            .setDescription("Questo utente non può ricevere **messaggi privati**\rAttiva questa opzione in **Impostazioni utente > Privacy e Sicurezza**")
                            .setImage("https://i.postimg.cc/PJ1GVqmc/attiva-Messaggi-Privati.gif")

                        message.channel.send(embed).then(msg => {
                            message.delete({ timeout: 10000 })
                                .catch(() => { })
                            msg.delete({ timeout: 10000 })
                                .catch(() => { })
                        })
                        return
                    })
            }
        }

    },
};