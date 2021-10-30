module.exports = {
    name: "help",
    aliases: ["aiuto", "comandi"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let totalPage = 8;
        let page = 1;

        let page1 = new Discord.MessageEmbed()
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

        let page2 = new Discord.MessageEmbed()
            .setTitle(":anchor: SERVER COMMANDS")
            .setDescription("Tutti i comandi specifici del server o del canale")
            .setColor("#2C5B7F")
            .addField("!youtube", `
Ottenere il link dei canali YouTube di Giulio
_Alias: \`!yt\`_
    `)
            .addField("!github", `
Tutti i link github dei bot e altri progetti di GiulioAndCode
            `)

            .addField("!code (codice)", `
Comandi, spiegazioni e tutorial di molte funzioni in discord.js
            `)

            .addField("!bug [report]", `
Reportare un bug o anomali nei bot o nel server
_Alias: \`!report\` \`!bugreport\`_
            `)
            .addField("!config", `
Attivare o disattivare le notifiche specifiche nel server
_Alias: \`!notifiche\` \`!notification\` \`!notifications\`_
            `)
            .addField("!invite", `
Ottenere il link d'invito per il server
            `)
            .addField("!test", `
Testare e vedere le informazioni del bot
_Alias: \`!prova\` \`!ping\`_
            `)

            .setFooter("Page 2/" + totalPage)

        let page3 = new Discord.MessageEmbed()
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

        let page4 = new Discord.MessageEmbed()
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
            .setFooter("Page 4/" + totalPage)

        let page5 = new Discord.MessageEmbed()
            .setTitle(":moneybag: LEVELING")
            .setDescription("Tutti i comandi sul livellamento")
            .setColor("#E2A871")
            .addField("!rank (user)", `
Informazioni sul livello di un utente
_Alias: \`!level\` \`!xp\`_
`)
            .addField("!leaderboard", `
Statistica completa di tutti gli utenti
_Alias: \`!lb\`_
`)
            .addField("!setlevel [user]", `
Impostare un livello a un utente
`)
            .setFooter("Page 5/" + totalPage)

        let page6 = new Discord.MessageEmbed()
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

        let page7 = new Discord.MessageEmbed()
            .setTitle(":closed_lock_with_key: PRIVATE ROOMS")
            .setDescription("Tutti i comandi sulla gestione di stanze private")
            .setColor("#FEAB33")
            .addField("!pdelete", `
Eliminare una stanza
_Alias: \`!pclose\`_
`)
            .addField("!lock", `
Rendere privata una stanza, in modo che possano entrare e vedere solo chi inviti tu
`)
            .addField("!padd [user]", `
Aggiungere un utente a una stanza privata
`)
            .addField("!premove [user]", `
Rimuovere un utente da una stanza privata
`)
            .addField("!pkick [user]", `
Kickare un utente da una stanza (potrà però rientrare quando vuole)
`)
            .addField("!prename [name]", `
Rinominare una stanza (solo se si possiede solo una stanza tesuale o solo vocale)
`)
            .addField("!ptrename [name]", `
Rinominare una stanza tesuale
`)
            .addField("!pvrename [name]", `
Rinominare una stanza vocale
`)
            .setFooter("Page 7/" + totalPage)

        let page8 = new Discord.MessageEmbed()
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
            .addField("!fban [user] (reason)", `
Bannare un utente forzatamente, espellendolo dal server
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
            .setFooter("Page 8/" + totalPage)

        message.channel.send(page1).then(msg => {
            msg.react('◀️').then(r => {
                msg.react('▶️')

                // Filters
                const reactIndietro = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id
                const reactAvanti = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id

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

    },
};