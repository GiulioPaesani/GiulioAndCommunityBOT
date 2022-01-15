module.exports = {
    name: "Missing Intents",
    aliases: ["missingintents", "intents"],
    description: "[CLIENT_MISSING_INTENTS]: Valid intents must be provided for the Client",
    info: "Dalla versione v13 è necessario specificare nella dichiarazione del client quali Intent il vostro bot potrà usare. Gli intent sono quello a cui il bot puo avere l'accesso di \"vedere\", come i messaggi in un server, i membri, le reazioni, ecc... Puoi trovare l'elenco di tutti gli intent [qui](https://discord.com/developers/docs/topics/gateway#list-of-intents). Mi raccomando però vai nel [pannello di controllo](https://discord.com/developers/applications) del tuo bot, nella sezione Bot e attiva tutte le spunte in \"Privileged Gateway Intents\"",
    category: "errors",
    id: "1640801258",
    video: "",
    v12: `
//Errore non presente in Discord.js v12`,
    v13: `
//Sostituire la dichiarazione del client in questo modo
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] //Aggiungere tutti quelli necessari al vostro bot
})

//Per avere direttamente tutti gli intents
const client = new Discord.Client({
    intents: 32767
})`
};
