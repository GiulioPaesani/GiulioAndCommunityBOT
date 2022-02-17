module.exports = {
    name: "tclose",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Eliminare un ticket",
    syntax: "!tclose",
    category: "community",
    channelsGranted: [],
    async execute(message, args, client, property) {
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
            return botCommandMessage(message, "CanaleNonConcesso", "", "", property)
        }

        var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
        var ticket = serverstats.ticket[index];

        if (!utenteMod(message.author) && message.author.id != ticket.owner && !message.member.roles.cache.has(settings.idRuoloAiutante) && !message.member.roles.cache.has(settings.idRuoloAiutanteInProva)) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi eseguire il comando `!tclose` in questo ticket")
        }

        client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
            .then(msg => {
                var button1 = new Discord.MessageButton()
                    .setLabel("In chiusura...")
                    .setStyle("DANGER")
                    .setCustomId("ticketChiudi")
                    .setDisabled()

                var row = new Discord.MessageActionRow()
                    .addComponents(button1)

                if (!ticket.inserimentoCategory)
                    msg.edit({ embeds: [msg.embeds[0]], components: [row] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Ticket in chiusura...")
            .setColor("#ED1C24")
            .setDescription("Questo ticket si chiuderà tra `20 secondi`")

        var button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId("annullaChiusura")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)

        var idChannelTicket = ticket.channel
        message.channel.send({ embeds: [embed], components: [row] })
            .then(msg => {
                ticket.daEliminare = true;
                serverstats.ticket[serverstats.ticket.findIndex((x) => x.channel == idChannelTicket)] = ticket;

                setTimeout(function () {
                    var ticket = serverstats.ticket.find((x) => x.channel == idChannelTicket);
                    if (!ticket) return;

                    if (ticket.daEliminare) {
                        embed.setDescription("Questo ticket si chiuderà tra `10 secondi`")
                        msg.edit({ embeds: [embed] })
                            .catch(() => { })

                        setTimeout(async function () {
                            var ticket = serverstats.ticket.find((x) => x.channel == idChannelTicket);
                            if (!ticket) return;

                            if (ticket.daEliminare) {
                                client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                                    .then(async msg => {
                                        var embed = new Discord.MessageEmbed()
                                            .setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
                                            .setColor("#22c90c")
                                            .addField(":alarm_clock: Time", `${moment(message.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                                            .addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)

                                        if (msg.embeds[0].title == ":speech_balloon: Segli CATEGORIA :speech_balloon:")
                                            embed.addField("Category", `_Null_`)
                                        else if (!msg.embeds[0].description.endsWith("`"))
                                            embed.addField("Category", msg.embeds[0].title.split(" ").slice(1, -1).join(" "))
                                        else
                                            embed.addField("Category", `${msg.embeds[0].title.split(" ").slice(1, -1).join(" ")} - ${msg.embeds[0].description.slice(1, -1)}`)

                                        if (ticket.inserimentoCategory)
                                            if (!isMaintenance())
                                                client.channels.cache.get(log.community.ticket).send({ embeds: [embed] })

                                        var embed = new Discord.MessageEmbed()
                                            .setTitle(":paperclips: Ticket closed :paperclips:")
                                            .setColor("#e31705")
                                            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                                            .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                                            .addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)

                                        if (msg.embeds[0].title == ":speech_balloon: Segli CATEGORIA :speech_balloon:")
                                            embed.addField("Category", `_Null_`)
                                        else if (!msg.embeds[0].description.startsWith("`"))
                                            embed.addField("Category", msg.embeds[0].title.split(" ").slice(1, -1).join(" "))
                                        else
                                            embed.addField("Category", `${msg.embeds[0].title.split(" ").slice(1, -1).join(" ")} - ${msg.embeds[0].description.split("`")[1]}`)

                                        var chatLog = ""
                                        await message.channel.messages.fetch()
                                            .then(async messages => {
                                                for (var msg of messages.reverse()) {
                                                    var msg = msg[1]
                                                    var attachments = ""
                                                    msg.attachments.forEach(attachment => {
                                                        attachments += `${attachment.name} (${attachment.url}), `
                                                    })
                                                    if (attachments != "")
                                                        attachments = attachments.slice(0, -2)

                                                    chatLog += `${msg.author.bot ? "[BOT] " : msg.author.id == ticket.owner ? "[OWNER] " : utenteMod(msg.author) ? "[MOD] " : (msg.member.roles.cache.has(settings.idRuoloAiutante) || msg.member.roles.cache.has(settings.idRuoloAiutanteInProva)) ? "[HELPER] " : ""}@${msg.author.username} - ${moment(msg.createdAt).format("ddd DD HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? `\nEmbed: ${msg.embeds[0].title}` : ""}${attachments ? `\nAttachments: ${attachments}` : ""}\n\n`
                                                }
                                            })

                                        if (chatLog != "") {
                                            var attachment1 = await new Discord.MessageAttachment(
                                                Buffer.from(chatLog, "utf-8"), `ticket${ticket.channel}-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.txt`
                                            );
                                            if (!isMaintenance())
                                                client.channels.cache.get(log.community.ticket).send({ embeds: [embed], files: [attachment1] })
                                        }
                                        else
                                            if (!isMaintenance())
                                                client.channels.cache.get(log.community.ticket).send({ embeds: [embed] })

                                        embed.setDescription("Questo ticket si sta per chiudere")
                                        msg.edit({ embeds: [embed] })
                                            .catch(() => { })

                                        message.channel.delete()
                                            .catch(() => { });
                                        serverstats.ticket = serverstats.ticket.filter((x) => x.channel != idChannelTicket);
                                    })
                            }
                        }, 10000);
                    }
                }, 10000);
            })
    },
};