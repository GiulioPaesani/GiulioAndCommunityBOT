module.exports = {
    name: "Token invalid",
    aliases: ["invalid token", "tokeninvalid"],
    description: "[TOKEN_INVALID]: An invalid token was provided.",
    info: "Questo token indica semplicemente che il token che avete inserito non è corretto. Controllate che sia giusto e scritto corretamente. Se invece è preso attraverso una variabile, essa non deve essere ovviamente messa tra virgolette",
    category: "errors",
    id: "1654680450",
    link: "https://www.toptal.com/developers/hastebin/ovirudosok.php",
    video: "",
    code: `
//Token scritto esplicitamente
client.login("token")

//Token in una variabile (inserito in un file config)
const {token} = require("./config.json")
client.login(token)

//Token inserito nel file .env o nelle variabile dell'hosting
client.login(process.env.token)`
};
