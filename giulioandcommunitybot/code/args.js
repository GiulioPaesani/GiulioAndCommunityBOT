module.exports = {
    name: "Args",
    aliases: ["argomenti"],
    description: "Come ottenere gli argomenti scritti in un comando",
    info: "",
    category: "utility",
    id: "1654680745",
    link: "https://www.toptal.com/developers/hastebin/fefazoviyo.js",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!comando")) { //Importante che ci sia startsWith in modo che il comando non deve essere solo "!comando" ma può continuare
        const args = message.content.split(/ +/); //Tutti gli argomenti

        let arg1 = args[1]; //Argomento 1

        let testo = args.slice(2).join(" "); //Con slice si rimuovono le prima due parole, e poi le successive vengono contatenate con uno spazio
    }
})`
};
