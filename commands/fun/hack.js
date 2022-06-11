const Discord = require("discord.js");
const colors = require("../../config/general/colors.json");
const settings = require("../../config/general/settings.json");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "hack",
    description: "Effetua una attacco hacker verso un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/hack [user]",
    category: "fun",
    client: "fun",
    data: {
        options: [
            {
                name: "user",
                description: "Utente che vuoi hackerare",
                type: "STRING",
                required: true,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.id == interaction.user.id) {
            return replyMessage(client, interaction, "Error", "Non da solo", "Non ti puoi hackerare da solo", comando)
        }

        let attacks = [
            ["Ricerca server disponibile...", "Connesso al server 127.0.0.1", "Download profilo Instagram...", "Download profilo Only Fans...", "Caricamento video su YouTube"],
            ["Ricerca indirizzo IP", "Attacco DOS a 127.60.12.0", "Inivio di 28 virus in corso...", "PC Windows10_Gianni collegato", "Collegamento a webcam effettuato"],
            ["Ricerca dati su twitter.com", "Profilo ottenuto", "Scarico dati", "Inivio dati a Mamma Cellulare", "Ripristino a opzioni di fabbrica in corso..."],
            ["Ricerca profilo su google.com", "932.213 risultati trovati in 4 nanosecondi", "312 foto acquisite", "Inivio dati al Governo Italiano", "Denuncia in corso per atti osceni in luogo pubblico..."],
            ["Inserimento dati profilo registro elettronico", "2 voti insufficienti trovati", "Voti sufficienti eliminati", "Creazione di 8 note disciplinari", "Invio lettera al Preside..."],
            ["Profilo Amazon trovato", "Aquisto di 5 rotoli scottecs", "Aquisto di 23 cocomeri", "Carta di credito clonata", "Prelievo di 732.283 euro in corso..."],
            ["Ricerca profilo Discord", "9 account trovati", "Segnalazione account contro TOS", "Account rimossi e bannati", "Nitro regalato a Giulio!"],
        ]

        let attack = attacks[Math.floor(Math.random() * attacks.length)]

        let embed = new Discord.MessageEmbed()
            .setTitle("Hacking in corso...")
            .setColor(colors.purple)
            .setDescription(`_Attacco hacker a ${utente.toString()}_\n${attack[0]}`)

        interaction.reply({ embeds: [embed] })

        setTimeout(() => {
            embed = new Discord.MessageEmbed()
                .setTitle("Hacking in corso...")
                .setColor(colors.purple)
                .setDescription(`_Attacco hacker a ${utente.toString()}_\n${attack[1]}`)

            interaction.editReply({ embeds: [embed] })
            setTimeout(() => {
                embed = new Discord.MessageEmbed()
                    .setTitle("Hacking in corso...")
                    .setColor(colors.purple)
                    .setDescription(`_Attacco hacker a ${utente.toString()}_\n${attack[2]}`)

                interaction.editReply({ embeds: [embed] })
                setTimeout(() => {
                    embed = new Discord.MessageEmbed()
                        .setTitle("Hacking in corso...")
                        .setColor(colors.purple)
                        .setDescription(`_Attacco hacker a ${utente.toString()}_\n${attack[3]}`)

                    interaction.editReply({ embeds: [embed] })
                    setTimeout(() => {
                        embed = new Discord.MessageEmbed()
                            .setTitle("Hacking in corso...")
                            .setColor(colors.purple)
                            .setDescription(`_Attacco hacker a ${utente.toString()}_\n${attack[4]}`)

                        interaction.editReply({ embeds: [embed] })
                        setTimeout(() => {
                            embed = new Discord.MessageEmbed()
                                .setTitle("Attacco hanking completato")
                                .setColor(colors.purple)
                                .setDescription(`_Attacco hacker a ${utente.toString()} terminato con successo_`)

                            interaction.editReply({ embeds: [embed] })
                        }, 500)
                    }, 1500)
                }, 2200)
            }, 2000)
        }, 1000)
    },
};