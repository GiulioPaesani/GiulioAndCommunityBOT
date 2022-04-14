setInterval(async function () {
    var data = new Date()
    if (data.getDate() == 11 && data.getMonth() == 3) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/8CzsZ9dC/Profilo-server-Easter.png");
            await server.setBanner("https://i.postimg.cc/c43xTZVh/Banner.png");
            await client.user.setAvatar("https://i.postimg.cc/J0f1mdBj/Profilo-bot-Easter.png");
        }
    }

    if (data.getDate() == 25 && data.getMonth() == 3) {
        if (data.getHours() == 0 && data.getMinutes() == 0 && data.getSeconds() == 0) {
            var server = await client.guilds.cache.get(config.idServer);

            await server.setIcon("https://i.postimg.cc/Pr3QZdyC/Profilo-server.png");
            await server.setBanner("https://i.postimg.cc/L6MpWDdP/Banner.jpg");
            await client.user.setAvatar("https://i.postimg.cc/XvDRzMnq/Profilo-bot.png");
        }
    }
}, 1000)

global.sendEasterMessage = async function () {
    let data = new Date()

    // if (data.getMinutes() != 0 || data.getSeconds() != 0 || data.getHours() != 0) return
    if (data.getMonth() != 3) return

    let giorno = data.getDate()

    if (giorno < 10 || giorno > 25) return

    let canale = client.channels.cache.get("959488063334142012")

    await canale.bulkDelete(100, true)

    await canale.send(`
----- :hatching_chick: 𝐒𝐀𝐕𝐄 𝐓𝐇𝐄 𝐄𝐀𝐒𝐓𝐄𝐑 :dove: -----
Sono anni che l'**elfo Tronny**, un lavoratore nella fabbrica dei regali di Babbo Natale, non riesce a scalare la classifica del miglior elfetto dell'anno a causa della scarsità di richiesta di regali da tutti i bambini del mondo che stanno perdendo la magia del Natale, attirati dalle tantissime uova nel giorno di **Pasqua** con tanti regali, ma soprattutto una valanga di cioccolato :chocolate_bar: 
I pochi doni che i bimbi chiedono a Babbo Natale, vengono incartati dai centinaia di folletti da tutta la Lapponia, l'elfo Tronny quindi ha bisogno che il Natale ritorni ad essere come lo era un tempo per riuscire ad accaparrarsi qualche dono da costruire e svettare nella classifica. Ha deciso quindi che la Pasqua dovrà essere **sabotata** e **distruggere **il desiderio di tutti i ragazzi del mondo all'idea delle numerose uova portate dal coniglio pasquale :dizzy_face: 

:closed_lock_with_key: Tronny ha rubato **14 uova di cioccolato** e le ha rinchiuse in **cassaforti **impenetrabili, sarà il vostro compito quello di scoprire i codici di tutte queste cassaforti e salvare la Pasqua!
`)

    await canale.send({ files: ["./easter/BannerEvento.png"] })

    await canale.send(`Ogni giorno apparirà una nuova sfida con **indovinelli**, **quiz** o **giochi** dove dovrai ottenere un codice segreto, che ti servirà per aprire le cassaforti di Tronny e liberale le uova di cioccolato

:gem: Utilizza il comando \`!eastercode [codice]\` (Disponibile solo in DM del bot) per riscattare un codice, otterrai **premi** e un numero di **punti** che si andranno a sommare a tutti gli altri che guadagnerai nel corso dell'evento, più la sfida è **difficile** e più sei **veloce** a risolverla più i punti vinti saranno maggiori!

:trophy: Al termine dell'evento i **migliori 5 utenti** riceveranno dei **super premi extra**, potrai risolvere le sfide disponibili in tutta la durata dell'evento, ma più sarai veloce più scalerai la classifica generale.
Guarda la classifica sempre aggiornata in questo canale oppure utilizza \`!easterlb\` per vedere l'elenco completo e la tua posizione

Potete collaborare e aiutarvi tra di voi per completare le sfide, ma è severamente vietato condividere i codici agli altri membri se si scoprono prima
:bangbang: Chiunque rivelerà i codici delle sfide ad altri utenti verrà **tempbannato** fino al termine dell'evento
Cercate di dare a tutti la possibilità di giocare e divertirsi

:warning: È necessario avere i **DM aperti**, in modo che il bot vi possa mandare messaggi in privato

L'evento termina il **24 Aprile** alle 23:59`)

    await canale.send(`\u200b
:placard: Puoi trovare i codici in diversi **formati**: 
- Lettere + Numeri (Come \`F81G5\`)
- Solo lettere (Come \`HRXEP\`)
- Solo numeri (Come \`62180\`)`)

    await canale.send({ files: ["./easter/EsempiCodici.png"] })

    let userstatsList = serverstats.easter

    userstatsList = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.get(x.id)).sort((a, b) => b.points - a.points)

    let page = 1
    let classifica = ""

    for (var i = 10 * (page - 1); i < 10 * page; i++) {
        if (userstatsList[i]) {
            switch (i) {
                case 0:
                    classifica += ":first_place: ";
                    break
                case 1:
                    classifica += ":second_place: "
                    break
                case 2:
                    classifica += ":third_place: "
                    break
                default:
                    classifica += `**#${i + 1}** `
            }

            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstatsList[i].id)

            classifica += `${utente.nickname ? utente.nickname : utente.user.username} - **${userstatsList[i].points}**\r`
        }
    }

    await canale.send(`\u200b
> **CLASSIFICA**
Classifica generale tra tutti gli utenti

${classifica || "_Nessun utente in classifica al momento_"}

:trophy: I primi 5 utenti in classifica al termine dell'evento guadagneranno **super premi extra**`)

    if (giorno == 10) {
        await canale.send(`\u200b
:warning: L'evento inizia **DOMANI** e durerà fino al 24 Aprile, preparatevi!`)
    }

    if (giorno >= 11) {
        await canale.send(`\u200b
> **SFIDA 1**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida1.png"] })
    }

    if (giorno >= 12) {
        await canale.send(`\u200b
> **SFIDA 2**
Risolvi il cruciverba, scopri le lettere nelle caselle contrassegnate e componi il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida2.png"] })
    }

    if (giorno >= 13) {
        await canale.send(`\u200b
> **SFIDA 3**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida3.png"] })

        client.channels.cache.get(settings.idCanaliServer.general).setTopic(":grey_exclamation: chat geNerale dove tuttI gli utenTi possono parlare, discutere e divertirSI :grey_exclamation:")
    }

    if (giorno >= 14) {
        await canale.send(`\u200b
> **SFIDA 4**
Risolvi l'indovinello e scopri il codice segreto
_:grey_exclamation: È necessario avere i DM aperti in modo che il bot vi possa mandare il codice_
`)

        await canale.send({ files: ["./easter/Sfida4.png"] })
    }

    if (giorno >= 15) {
        await canale.send(`\u200b
> **SFIDA 5**
Risolvi le espressioni matematiche e scopri i numeri del codice segreto
`)

        await canale.send({ files: ["./easter/Sfida5.png"] })
    }

    if (giorno >= 16) {
        await canale.send(`\u200b
> **SFIDA 6**
Risolvi l'indovinello e scopri il codice segreto
_:grey_exclamation: È necessario avere i DM aperti in modo che il bot vi possa mandare il codice_
`)

        await canale.send({ files: ["./easter/Sfida6.png"] })
    }

    if (giorno >= 17) {
        await canale.send(`\u200b
> **SFIDA 7**
Risolvi l'indovinello e scopri il codice segreto
_:grey_exclamation: È necessario avere i DM aperti in modo che il bot vi possa mandare il codice_
`)

        await canale.send({ files: ["./easter/Sfida7.png"] })
    }

    if (giorno >= 18) {
        await canale.send(`\u200b
> **SFIDA 8**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida8.png"] })
    }

    if (giorno >= 19) {
        await canale.send(`\u200b
> **SFIDA 9**
Risolvi il sudoku, scopri i numeri nelle caselle contrassegnate e componi il codice segreto
_Non sai come si gioca a sudoku? Guarda questo tutorial per scoprirlo: <https://youtu.be/N_pOilzvGv4>_
`)

        await canale.send({ files: ["./easter/Sfida9.png"] })
    }

    if (giorno >= 20) {
        await canale.send(`\u200b
> **SFIDA 10**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida10.png"] })
    }

    if (giorno >= 21) {
        await canale.send(`\u200b
> **SFIDA 11**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida11.png"] })
    }

    if (giorno >= 22) {
        await canale.send(`\u200b
> **SFIDA 12**
Rispondi alle domande, ottieni le risposte e componi il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida12.png"] })
    }

    if (giorno >= 23) {
        await canale.send(`\u200b
> **SFIDA 13**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida13.png"] })
    }

    if (giorno >= 24) {
        await canale.send(`\u200b
> **SFIDA 14**
Risolvi l'indovinello e scopri il codice segreto
`)

        await canale.send({ files: ["./easter/Sfida14.png"] })
    }

    classifica = ""

    for (var i = 0; i < 5; i++) {
        if (userstatsList[i]) {
            switch (i) {
                case 0:
                    classifica += ":first_place: ";
                    break
                case 1:
                    classifica += ":second_place: "
                    break
                case 2:
                    classifica += ":third_place: "
                    break
                default:
                    classifica += `**#${i + 1}** `
            }

            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstatsList[i].id)

            classifica += `${utente.nickname ? utente.nickname : utente.user.username} - **${userstatsList[i].points}**\r`
        }
    }


    if (giorno >= 25) {
        await canale.send(`\u200b
:high_brightness: **EVENTO TERMINATO** :high_brightness: 
L'evento è finito, spero vi siate **divertiti**. Ma andiamo a scoprire quali sono i **5 migliori** utenti nella classifica:

${classifica}

:trophy: Congratulazioni a questi utenti che riceveranno **super premi extra**
Bravissimi anche a tutti gli altri membri, tutte le uova sono stale liberate e la Pasqua è salva!
`)

        for (var i = 0; i < 4; i++) {
            if (userstatsList[i]) {
                var utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstatsList[i].id)

                let embed = new Discord.MessageEmbed()
                    .setTitle("Grandissimo, sei stato il migliore!")
                    .setColor("#EF7A98")
                    .setDescription("L'evento di Pasqua è terminato e sei arrivato nella **TOP 5** nella classifica generale, CONGRATULAZIONI!\rRicevi quindi un sacco di **super premi extra**")
                    .addField(":gift: Premi extra vinti", `
+ 15000 XP
+ 1000 Coins
`)
                utente.send({ embeds: [embed] })
                    .catch(() => { })


                var userstats = userstatsList.find(x => x.id == utente.id);
                if (userstats) {
                    userstats = await addXp(userstats, 15000, 0, true);
                    userstats.money += 1000
                    userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
                }
            }
        }
    }
}



global.codeInCommands = function () {
    var data = new Date()

    if (data.getDate() < 18 || data.getDate() > 24) return
    if (data.getMinutes() != 0 || data.getSeconds() != 0) return

    client.channels.cache.get(settings.idCanaliServer.commands).send("`63GQC`")
        .then(msg => {
            setTimeout(() => msg.delete(), 1000)
        })
}

setInterval(async function () {
    let canale = client.channels.cache.get("959488063334142012")

    canale.messages.fetch()
        .then(async messages => {
            for (let msg of Array.from(messages.values()).reverse()) {
                if (msg.content.includes("**CLASSIFICA**")) {
                    let userstatsList = serverstats.easter

                    userstatsList = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.get(x.id)).sort((a, b) => b.points - a.points)

                    let page = 1
                    let classifica = ""

                    for (var i = 10 * (page - 1); i < 10 * page; i++) {
                        if (userstatsList[i]) {
                            switch (i) {
                                case 0:
                                    classifica += ":first_place: ";
                                    break
                                case 1:
                                    classifica += ":second_place: "
                                    break
                                case 2:
                                    classifica += ":third_place: "
                                    break
                                default:
                                    classifica += `**#${i + 1}** `
                            }

                            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstatsList[i].id)

                            classifica += `${utente.nickname ? utente.nickname : utente.user.username} - **${userstatsList[i].points}**\r`
                        }
                    }

                    msg.edit(`\u200b
> **CLASSIFICA**
Classifica generale tra tutti gli utenti

${classifica || "_Nessun utente in classifica al momento_"}

:trophy: I primi 5 utenti in classifica al termine dell'evento guadagneranno **super premi extra**`)

                }
            }
        })
}, 1000 * 60 * 5)