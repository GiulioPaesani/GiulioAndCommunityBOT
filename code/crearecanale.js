module.exports = {
    name: "Creare canale",
    aliases: ["crearecanale", "createcanale", "createchannel"],
    description: "**Creare** un canale con nome, permessi e topic",
    category: "manage",
    id: "1639466147",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content == "!comando") {
        message.guild.channels.create("NomeCanale", { //Nome canale
            type: "text",
            topic: "Descrizione", //Descrizione (topic)
            parent: "Categoria", //Categoria
            permissionOverwrites: [
                /*
                    id = id dell'utente/ruolo
                    allow = permessi che vengono concesse in quel canale
                    deny = permessi che vengono tolte in quel canale
                */
                {
                    id: message.guild.id, //everyone
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.member.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ]
        })
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        message.guild.channels.create("NomeCanale", { //Nome canale
            type: "text",
            topic: "Descrizione", //Descrizione (topic)
            parent: "Categoria", //Categoria
            permissionOverwrites: [
                /*
                    id = id dell'utente/ruolo
                    allow = permessi che vengono concesse in quel canale
                    deny = permessi che vengono tolte in quel canale
                */
                {
                    id: message.guild.id, //everyone
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.member.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ]
        })
    }
})`
};
