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