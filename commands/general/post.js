const Discord = require("discord.js");
const validator = require('validator');
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "post",
    description: "Posta un tuo progetto inserendo titolo, descrizione, immagine e molto altro",
    permissionLevel: 0,
    requiredLevel: 30,
    cooldown: 30,
    syntax: "/post [title] [description] (image) (textbutton1) (linkbutton1) (textbutton2) (linkbutton2)",
    category: "general",
    data: {
        options: [
            {
                name: "title",
                description: "Titolo del tuo progetto",
                type: "STRING",
                required: true
            },
            {
                name: "description",
                description: "Descrizione del tuo progetto",
                type: "STRING",
                required: true
            },
            {
                name: "image",
                description: "Link dell'immagine da inserire",
                type: "STRING",
                required: false
            },
            {
                name: "textbutton1",
                description: "Testo del primo bottone",
                type: "STRING",
                required: false
            },
            {
                name: "linkbutton1",
                description: "Link del primo bottone",
                type: "STRING",
                required: false
            },
            {
                name: "textbutton2",
                description: "Testo del secondo bottone",
                type: "STRING",
                required: false
            },
            {
                name: "linkbutton2",
                description: "Link del secondo bottone",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let title = interaction.options.getString("title")
        let description = interaction.options.getString("description")
        let image = interaction.options.getString("image")
        let textbutton1 = interaction.options.getString("textbutton1")
        let linkbutton1 = interaction.options.getString("linkbutton1")
        let textbutton2 = interaction.options.getString("textbutton2")
        let linkbutton2 = interaction.options.getString("linkbutton2")

        if (title.length > 256) {
            return replyMessage(client, interaction, "Warning", "Titolo troppo lungo", "Puoi scrivere un titolo solo fino a 256 caratteri", comando)
        }

        if (description.length > 1024) {
            return replyMessage(client, interaction, "Warning", "Descrizione troppo lunga", "Puoi scrivere una descrizione solo fino a 1024 caratteri", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi il tuo progetto?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** il tuo post? Una volta creato verrà **inviato** allo staff che dovrà accettarlo, e nel caso verrà pubblicato nel canale <#${settings.idCanaliServer.ourProjects}>. Verranno accettati solo progetti molto interessanti!`)
            .addField(title, description)

        if (image) {
            if (!image.startsWith("https://") && !image.startsWith("http://")) image = "https://" + image

            try {
                let test = new Discord.MessageEmbed()
                    .setImage(image)
            }
            catch {
                return replyMessage(client, interaction, "Error", "Link immagine non valido", "Hai inserito un link dell'immagine non valido", comando)
            }

            embed.setImage(image)
        }

        let row = new Discord.MessageActionRow()

        if ((textbutton1 && !linkbutton1) || (!textbutton1 && linkbutton1)) {
            return replyMessage(client, interaction, "Warning", "Bottone1 non valido", "Per inserire il primo bottone è necessario che inserisci sia il testo che il link di esso", comando)
        }
        if (linkbutton1) {
            if (textbutton1.length > 100) {
                return replyMessage(client, interaction, "Warning", "Testo bottone1 troppo lungo", "Il testo del primo bottone può avere un massimo di 100 caratteri", comando)
            }

            if (!linkbutton1.startsWith("https://") && !linkbutton1.startsWith("http://") && !linkbutton1.startsWith("discord")) linkbutton1 = "https://" + linkbutton1

            try {
                let test = new Discord.MessageEmbed()
                    .setImage(image)
            }
            catch {
                return replyMessage(client, interaction, "Warning", "Link bottone1 non valido", "Hai inserito un link del primo bottone non valido", comando)
            }

            let button = new Discord.MessageButton()
                .setLabel(textbutton1)
                .setStyle("LINK")
                .setURL(linkbutton1)

            row.addComponents(button)
        }

        if ((textbutton2 && !linkbutton2) || (!textbutton2 && linkbutton2)) {
            return replyMessage(client, interaction, "Warning", "Bottone2 non valido", "Per inserire il secondo bottone è necessario che inserisci sia il testo che il link di esso", comando)
        }
        if (linkbutton2) {
            if (!validator.isURL(linkbutton2)) {
                return replyMessage(client, interaction, "Warning", "Link bottone2 non valido", "Hai inserito un link del secondo bottone non valido", comando)
            }

            if (textbutton2.length > 100) {
                return replyMessage(client, interaction, "Warning", "Testo bottone2 troppo lungo", "Il testo del secondo bottone può avere un massimo di 100 caratteri", comando)
            }

            if (!linkbutton2.startsWith("https://") && !linkbutton2.startsWith("http://") && !linkbutton2.startsWith("discord")) linkbutton2 = "https://" + linkbutton2

            let button = new Discord.MessageButton()
                .setLabel(textbutton2)
                .setStyle("LINK")
                .setURL(linkbutton2)

            row.addComponents(button)
        }

        let button3 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaProgetto,${interaction.user.id}`)

        let button4 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaProgetto,${interaction.user.id}`)

        let row2 = new Discord.MessageActionRow()
            .addComponents(button3)
            .addComponents(button4)

        interaction.reply({ embeds: [embed], components: linkbutton1 || linkbutton2 ? [row, row2] : [row2], fetchReply: true })
            .then(msg => setTimeout(() => msg.delete(), 1000 * 30))
    },
};