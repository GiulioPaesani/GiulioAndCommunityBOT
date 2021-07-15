module.exports = {
    name: "crearecanale",
    aliases: ["createcanale","createchannel"],
    description: "**Creare** un canale con nome, permessi e topic",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        message.guild.channels.create("NomeCanale", { //Nome canale
            type: "text",
        }).then((canale) => {
            //SETTAGGI OPZIONALI
            canale.setTopic("Descrizione"); //Descrizione (topic)
            canale.setParent("idCategoria"); //Categoria
            canale.overwritePermissions([
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
            ]);
        })
    }
})`
};
