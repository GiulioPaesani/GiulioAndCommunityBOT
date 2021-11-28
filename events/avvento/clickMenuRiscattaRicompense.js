const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: `clickMenu`,
    async execute(menu) {
        if (settings.inMaintenanceMode)
            if (menu.clicker.user.id != settings.idGiulio) return

        if (menu.id != "riscattaRicompense") return

        var avvento = serverstats.avvento[menu.clicker.user.id]
        if (!avvento) return menu.message.edit({
            embed: menu.message.embeds[0],
            components: menu.message.components
        })

        //? var day = new Date().getDate()
        //? var month = new Date().getMonth()
        var day = 30
        var month = 11

        if (month == 11 || (month == 0 && day <= 6)) {

        }
        else {
            return
        }

        var numGiorno = menu.values[0]

        menu.reply.defer()

        if (numGiorno.startsWith("ND") || avvento[numGiorno])
            return menu.message.edit({
                embed: menu.message.embeds[0],
                components: menu.message.components
            })

        var embed = new Discord.MessageEmbed()
            .setTitle(`Giorno ${numGiorno}`)
            .setColor("#ED1C24")
            .setThumbnail(avventoJSON.iconGiorno[numGiorno])
            .setDescription(`Riscatta la ricompensa del **giorno ${numGiorno}**`)
            .setFooter("Clicca su \"Riscatta ricompensa\" per ricevere il premio")

        switch (parseInt(numGiorno)) {
            case 1: {
                embed
                    .addField(":gift: Premio del giorno", `__100 punti esperienza__
                    
Ricevi 100 punti xp per salire di livello all'interno del server`)
            } break;
            case 2: {
                embed
                    .addField(":gift: Premio del giorno", `__Utilizzare la funzione "here" in !code__
                    
Avrai il permesso di utilizzare "here" con il comando \`!code\`. Potrai mandare un codice direttamente in **chat**, per farlo la sintassi del comando è \`!code [codice] here\``)
            } break;
            case 3: {
                embed
                    .addField(":gift: Premio del giorno", `__Boost livellamento x2 per 12 ore__
                    
Normalmente per ogni messaggio inviato il bot ti darà dai 15 a 40 punti **esperienza**, riscattando questo premio il punteggio per ogni messaggio verrà **raddoppiato**, quindi dai 30 ai 80 punti per messaggio`)
            } break;
            case 4: {
                embed
                    .addField(":gift: Premio del giorno", `__200 punti esperienza__
                    
Ricevi 200 punti xp per salire di livello all'interno del server`)
            } break;
            case 5: {
                embed
                    .addField(":gift: Premio del giorno", `__1 livello di esperienza__
                    
Qualsiasi livello tu abbia, con questo premio nei avrai **uno in più**`)
            } break;
            case 6: {
                embed
                    .addField(":gift: Premio del giorno", `__300 punti esperienza__
                    
Ricevi 300 punti xp per salire di livello all'interno del server`)
            } break;
            case 7: {
                embed
                    .addField(":gift: Premio del giorno", `__Regalo misterioso__
                    
Ricevi un **super regalo**, ma misterioso, senza sapere cosa sia. Scoprirai il contenuto dopo il **Changelog** del 15/01`)
            } break;
            case 8: {
                embed
                    .addField(":gift: Premio del giorno", `__500 punti esperienza__
                    
Ricevi 500 punti xp per salire di livello all'interno del server`)
            } break;
            case 9: {
                embed
                    .addField(":gift: Premio del giorno", `__Freddura super divertente by Giulio__
                    
Sei pronto a morire dalle risate con una mini **barzelletta** casuale? Bhe, immagino che tu non veda l'ora`)
            } break;
            case 10: {
                embed
                    .addField(":gift: Premio del giorno", `__Regala 500 punti esperienza a qualcuno__
                    
**Nessun** regalo per te oggi, mi spiace. Potrai essere però un piccolo Babbo Natale per un giorno, scegli a chi regalare **500 punti** esperienza. Utilizza il comando \`!regalaxp [user]\` e fai un piccolo **regalo** a qualcuno`)
            } break;
            case 11: {
                embed
                    .addField(":gift: Premio del giorno", `__Stanza pubblica__
                    
Hai una **stanza privata** super figa e interessante? Bhe potrai, se vuoi, renderla **pubblica**, in modo che tutti gli utenti nel server possano partecipare e **divertirsi** insieme a te. Utilizza il comando \`!punlock\` e renderai la tua stanza pubblica`)
            } break;
            case 12: {
                embed
                    .addField(":gift: Premio del giorno", `__Addio errori in Counting__
                    
Dai lo so che tutti i tuoi errori in **Counting** sono dovuti solo per una piccola **distrazione** (si si certo, secondo me non sai proprio contare). Oggi però sono molto gentile, avrai la possibilità di **azzerarti** (_una solta volta_) tutti gli errori che hai fatto in Counting. Clicca sul pulsate qua sotto per resettare a 0 i tuoi errori`)
            } break;
            case 13: {
                embed
                    .addField(":gift: Premio del giorno", `__700 punti esperienza__
                    
Ricevi 700 punti xp per salire di livello all'interno del server`)
            } break;
            case 14: {
                embed
                    .addField(":gift: Premio del giorno", `__Emoji di Natale__
                    
Ricevi due fantastiche **emoji** a tema **Natale** da utilizzare ovunque nel server`)
                    .setImage("https://i.postimg.cc/zBVcDXW9/Emoji-Natale1.png")
            } break;
            case 15: {
                embed
                    .addField(":gift: Premio del giorno", `__1000 punti esperienza__
                    
Ricevi 1000 punti xp per salire di livello all'interno del server`)
            } break;
            case 16: {
                embed
                    .addField(":gift: Premio del giorno", `__Spoiler del prossimo changelog__
                    
Il **Changelog** del 15/01, per festeggiare un anno della nascita del server, sarà un **aggiornamento** straordinario, con un sacco di funzioni e comandi super fighissimi. Bhe oggi avrete la possibilità di ricevere un piccolissimo **spoiler casuale** del prossimo update`)
            } break;
            case 17: {
                embed
                    .addField(":gift: Premio del giorno", `__Utilizzare i comandi ovunque__
                    
Riscattando questo premio avrete il permesso di utilizzare qualsiasi **comando** (_tranne il !say_) in qualsiasi **chat** nel server`)
            } break;
            case 18: {
                embed
                    .addField(":gift: Premio del giorno", `__Freddura super divertente by Giulio__
                    
Sei pronto a morire dalle risate con una mini **barzelletta** casuale? Bhe, immagino che tu non veda l'ora`)
            } break;
            case 19: {
                embed
                    .addField(":gift: Premio del giorno", `__2 livelli di esperienza__
                    
Qualsiasi livello tu abbia, con questo premio nei avrai **due in più**`)
            } break;
            case 20: {
                embed
                    .addField(":gift: Premio del giorno", `__Emoji di Natale__
                    
Ricevi due fantastiche **emoji** a tema **Natale** da utilizzare ovunque nel server`)
                    .setImage("https://i.postimg.cc/GtDgY7XK/Emoji-Natale2.png")
            } break;
            case 21: {
                embed
                    .addField(":gift: Premio del giorno", `__Boost livellamento x3 per 12 ore__
                    
Normalmente per ogni messaggio inviato il bot ti darà dai 15 a 40 punti **esperienza**, riscattando questo premio il punteggio per ogni messaggio verrà **triplicato**, quindi dai 45 ai 120 punti per messaggio`)
            } break;
            case 22: {
                embed
                    .addField(":gift: Premio del giorno", `__Emoji di Capodanno__
                    
È finito anche questo anno, siamo un anno più vecchi, eh già. Però dai, sii felice perchè con questo premio riceverai due fantastiche **emoji** a tema **Capodanno** da utilizzare ovunque nel server`)
                    .setImage("https://i.postimg.cc/0QFHzR0r/Emoji-Capodanno.png")
            } break;
            case 23: {
                embed
                    .addField(":gift: Premio del giorno", `__Togli 500 punti esperienza a qualcuno__
                    
È arrivato il momento di diventare un piccolo **ladro**. Oggi potrai, se vuoi, rimuovere 500 punti esperienza a un qualunque utente nel server. Non ti verranno **riaddebiti** a te questi punti, però potrai **divertirti** a fare un **dispetto** a qualcuno. Utilizza il comando \`!toglixp [user]\``)
            } break;
            case 24: {
                embed
                    .addField(":gift: Premio del giorno", `__Cartolina di Natale__
                    
Stanno arrivando i **pranzi** e cene con la nonna, la zia, la prozia, i cugini di quarto grado. Invece di dire un semplice e scontato **"Buon Natale"** potrai usare una una **cartolina** a tema community super carina per fare gli auguri in un modo molto interessante`)
            } break;
            case 25: {
                embed
                    .addField(":gift: Premio del giorno", `__5000 punti esperienza__
                    
Ricevi 5000 punti xp per salire di livello all'interno del server`)
            } break;
        }

        var button1 = new disbut.MessageButton()
            .setLabel("Ritorna all'avvento")
            .setID("ritornaAvvento")
            .setStyle("red")

        var button2 = new disbut.MessageButton()
            .setLabel("Riscatta ricompensa")
            .setID(`riscattaRicompensa,${numGiorno}`)
            .setStyle("green")

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        menu.message.edit({
            embed: embed,
            components: row
        })
    },
};