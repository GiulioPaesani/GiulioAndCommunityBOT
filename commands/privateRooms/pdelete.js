module.exports = {
    name: "pdelete",
    aliases: ["pclose"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Eliminare una stanza privata",
    syntax: "!pdelete",
    category: "privateRooms",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var privaterooms = serverstats.privateRooms

        var room
        if (privaterooms.find(x => x.text == message.channel.id)) {
            if (message.author.id == privaterooms.find(x => x.text == message.channel.id).owner || utenteMod(message.author)) {
                room = privaterooms.find(x => x.text == message.channel.id)
            }
            else {
                return botCommandMessage(message, "NonPermesso", "", "Non hai il permesso di eseguire questo comando in questa stanza")
            }
        }
        else {
            if (!privaterooms.find(x => x.owner == message.author.id)) {
                return botCommandMessage(message, "Warning", "Non hai una stanza privata", "Per usare questo comando devi essere owner di una stanza privata")
            }
            room = privaterooms.find(x => x.owner == message.author.id)
        }

        botCommandMessage(message, "Correct", "Stanza in eliminazione", room.type == "onlyText" || room.type == "onlyVoice" ? "Il tuo canale privato si eliminerà a breve" : "I tuoi canali privati si elimineranno a breve")

        setTimeout(async () => {
            var embed = new Discord.MessageEmbed()
                .setTitle(":paperclips: Room closed :paperclips:")
                .setColor("#e31705")
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                .addField(":bust_in_silhouette: Owner", `${client.users.cache.get(room.owner).toString()} - ID: ${room.owner}`)

            var chatLog = ""
            if (room.text) {
                await client.channels.cache.get(room.text).messages.fetch()
                    .then(async messages => {
                        for (var msg of messages.reverse()) {
                            var msg = msg[1]
                            var attachments = ""
                            msg.attachments.forEach(attachment => {
                                attachments += `${attachment.name} (${attachment.url}), `
                            })
                            if (attachments != "")
                                attachments = attachments.slice(0, -2)

                            chatLog += `${msg.author.bot ? "[BOT] " : msg.author.id == room.owner ? "[OWNER] " : utenteMod(msg.author) ? "[MOD] " : ""}@${msg.author.username} - ${moment(msg.createdAt).format("ddd DD HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? `\nEmbed: ${msg.embeds[0].title}` : ""}${attachments ? `\nAttachments: ${attachments}` : ""}\n\n`
                        }
                    })
            }

            if (chatLog != "") {
                var attachment1 = await new Discord.MessageAttachment(
                    Buffer.from(chatLog, "utf-8"), `room${room.owner}-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.txt`
                );
                if (!isMaintenance())
                    client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed], files: [attachment1] })
            }
            else
                if (!isMaintenance())
                    client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed] })

            if (room.text && client.channels.cache.get(room.text))
                client.channels.cache.get(room.text).delete()
                    .catch(() => { })
            if (room.voice && client.channels.cache.get(room.voice))
                client.channels.cache.get(room.voice).delete()
                    .catch(() => { })
        }, 1000 * 10)

        serverstats.privateRooms = serverstats.privateRooms.filter(x => x.owner != message.author.id)
    },
};
