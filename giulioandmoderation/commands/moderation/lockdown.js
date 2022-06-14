const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const illustrations = require("../../config/general/illustrations.json")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage")
const { getServer } = require("../../functions/database/getServer")
const { updateServer } = require("../../functions/database/updateServer")

module.exports = {
    name: "lockdown",
    description: "Abilitare/Disabilitare il sistema di blocco nel server",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/lockdown [state]",
    category: "moderation",
    client: "moderation",
    data: {
        options: [
            {
                name: "state",
                description: "Abilitare o disabilitare il sistema di lockdown",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "🟢 ON",
                        value: "on",
                    },
                    {
                        name: "🔴 OFF",
                        value: "off",
                    }
                ]
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let state = interaction.options.getString("state")
        let everyone = interaction.guild.roles.everyone

        if (state == "on") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":skull: Lockdown ATTIVATO :skull:")
                .setColor(colors.red)
                .setThumbnail(illustrations.lockdownOn)
                .setDescription(`È appena stato attivato il **sistema di lockdown**
                
Tutti gli utenti con inferiori al ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == "Level 10").toString()} non vedranno piu nessun canale fino alla disattivazione di questo sistema`)

            interaction.reply({ embeds: [embed] })

            everyone.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_VAD", "USE_EXTERNAL_EMOJIS"])

            let canale = client.channels.cache.get(settings.idCanaliServer.lockdown);
            canale.permissionOverwrites.edit(everyone, {
                VIEW_CHANNEL: true,
            })
            canale.messages.fetch()
                .then(messages => {
                    embed = new Discord.MessageEmbed()
                        .setTitle(":skull: Lockdown ATTIVATO :skull:")
                        .setColor(colors.red)
                        .setThumbnail(illustrations.lockdownOn)
                        .setDescription(`È stato attivato il **sistema di lockdown** di questo server per evitare un possibile **raid** o **situazioni gravi**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level 10`).toString()} non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                    Array.from(messages.values())[0].edit({ embeds: [embed] })
                })

            if (interaction.channelId != settings.idCanaliServer.general)
                client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed] })
        }
        else {
            let embed = new Discord.MessageEmbed()
                .setTitle(":skull: Lockdown DISATTIVATO :skull:")
                .setColor(colors.green)
                .setThumbnail(illustrations.lockdownOff)
                .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti possono continuare a partecipare nel server")

            interaction.reply({ embeds: [embed] })

            everyone.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD", "USE_EXTERNAL_EMOJIS"])

            let canale = client.channels.cache.get(settings.idCanaliServer.lockdown);
            canale.permissionOverwrites.edit(everyone, {
                VIEW_CHANNEL: false,
            })
            canale.messages.fetch()
                .then(messages => {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(":skull: Lockdown DISATTIVATO :skull:")
                        .setColor(colors.green)
                        .setThumbnail(illustrations.lockdownOff)
                        .setDescription(`Il **sistema di lockdown** è ora disattivato, tutti i pericoli sono stati scampati. Potete ritornare a **scrivere** e divertirvi all'interno del server`)

                    Array.from(messages.values())[0].edit({ embeds: [embed] })
                })

            if (interaction.channelId != settings.idCanaliServer.general)
                client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed] })
        }
    },
};