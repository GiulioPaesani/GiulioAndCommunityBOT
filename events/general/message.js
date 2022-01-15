module.exports = {
    name: "message",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.channel.type == "dm") return
        if (message.author.bot) return
        if (message.guild.id != settings.idServer) return //Server sconosciuti non accettati

        trovata = getParolaccia(message.content)[0];
        if (trovata && !utenteMod(message.author)) return

        if ([settings.idCanaliServer.welcome, settings.idCanaliServer.announcements, settings.idCanaliServer.rules, settings.idCanaliServer.info, settings.idCanaliServer.youtubeNotification, settings.idCanaliServer.becomeHelper, settings.idCanaliServer.staffHelp, settings.idCanaliServer.levelUp, settings.idCanaliServer.log, settings.idCanaliServer.privateRooms, settings.idCanaliServer.mutedTicket, settings.idCanaliServer.tempmutedTicket, settings.idCanaliServer.bannedTicket, settings.idCanaliServer.tempbannedTicket, settings.idCanaliServer.lockdown].includes(message.channel.id)) {
            if (message.author.id != settings.idGiulio)
                message.delete()
                    .catch(() => { })
        }

        var messageContent = message.content.toLowerCase().trim();

        //REACTION MESSAGE
        if (messageContent == "wow")
            message.react(`<:GiulioWow:${client.emojis.cache.find(emoji => emoji.name === "GiulioWow")?.id}>`).catch(() => { return })
        if (messageContent == "rip")
            message.react(`<:GiulioRip:${client.emojis.cache.find(emoji => emoji.name === "GiulioRip")?.id}>`).catch(() => { return })
        if (messageContent == "sad" || messageContent == "piango" || messageContent == "triste" || messageContent == "sono triste")
            message.react(`<:GiulioPiangere:${client.emojis.cache.find(emoji => emoji.name === "GiulioPiangere")?.id}>`).catch(() => { return })
        if (messageContent == "ok" || messageContent == "okay")
            message.react(`<:GiulioOK:${client.emojis.cache.find(emoji => emoji.name === "GiulioOK")?.id}>`).catch(() => { return })
        if (messageContent == "love" || messageContent == "amore" || messageContent == "ti amo")
            message.react(`<:GiulioLove:${client.emojis.cache.find(emoji => emoji.name === "GiulioLove")?.id}>`).catch(() => { return })
        if (messageContent == "lol")
            message.react(`<:GiulioLOL:${client.emojis.cache.find(emoji => emoji.name === "GiulioLOL")?.id}>`).catch(() => { return })
        if (messageContent == "ciao" || messageContent == "hi" || messageContent == "hello" || messageContent == "salve")
            message.react(`<:GiulioHi:${client.emojis.cache.find(emoji => emoji.name === "GiulioHi")?.id}>`).catch(() => { return })
        if (messageContent == "gg")
            message.react(`<:GiulioGG:${client.emojis.cache.find(emoji => emoji.name === "GiulioGG")?.id}>`).catch(() => { return })
        if (messageContent == "f")
            message.react(`<:GiulioF:${client.emojis.cache.find(emoji => emoji.name === "GiulioF")?.id}>`).catch(() => { return })
        if (messageContent == "cosa?" || messageContent == "non ho capito" || messageContent == "cosa? non ho capito")
            message.react(`<:GiulioDomandoso:${client.emojis.cache.find(emoji => emoji.name === "GiulioDomandoso")?.id}>`).catch(() => { return })
        if (messageContent == "buonanotte" || messageContent == "notte" || messageContent == "buona notte" || messageContent == "ho sonno")
            message.react(`<:GiulioBuonanotte:${client.emojis.cache.find(emoji => emoji.name === "GiulioBuonanotte")?.id}>`).catch(() => { return })
        if (messageContent == "cool" || messageContent == "figo" || messageContent == "figata")
            message.react(`<:GiulioCool:${client.emojis.cache.find(emoji => emoji.name === "GiulioCool")?.id}>`).catch(() => { return })
        if (messageContent == "ban")
            message.react(`<:GiulioBan:${client.emojis.cache.find(emoji => emoji.name === "GiulioBan")?.id}>`).catch(() => { return })
        if (messageContent == "popcorn" || messageContent == "pop corn")
            message.react(`<:GiulioPopCorn:${client.emojis.cache.find(emoji => emoji.name === "GiulioPopCorn")?.id}>`).catch(() => { return })
        if (messageContent == "sus")
            message.react(`<:GiulioSus:${client.emojis.cache.find(emoji => emoji.name === "GiulioSus")?.id}>`).catch(() => { return })
        if (messageContent == "cringe")
            message.react(`<:GiulioCringe:${client.emojis.cache.find(emoji => emoji.name === "GiulioCringe")?.id}>`).catch(() => { return })
    },
};