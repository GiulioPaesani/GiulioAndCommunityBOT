const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { checkBadwords } = require("../../functions/moderation/checkBadwords")
const { getEmoji } = require("../../functions/general/getEmoji");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (isMaintenance(message.author.id) && !message.author.bot) return
        if (message.guild?.id != settings.idServer) return

        if (message.channel.id == settings.idCanaliServer.onewordstory) return

        let content = message.content.toLowerCase().trim()

        if (["giulio", "giulioandcode", "giulio paesani"].includes(content))
            message.react(getEmoji(client, "Giulio").toString()).catch(() => { })

        if (["arrabbiato", "sono arrabbiatissimo", "sono incazzato", "è incazzato", "sono incazzato nero", "è incazzato nero"].includes(content))
            message.react(getEmoji(client, "GiulioAngry").toString()).catch(() => { })

        if (["wow"].includes(content))
            message.react(getEmoji(client, "GiulioWow").toString()).catch(() => { })

        if (["ban", "io ti banno"].includes(content))
            message.react(getEmoji(client, "GiulioBan").toString()).catch(() => { })

        if (["rip", "riposa in pace"].includes(content))
            message.react(getEmoji(client, "GiulioRip").toString()).catch(() => { })

        if (["sad", "piango", "triste", "sono triste"].includes(content))
            message.react(getEmoji(client, "GiulioPiangere").toString()).catch(() => { })

        if (["ok", "okay", "ok capito"].includes(content))
            message.react(getEmoji(client, "GiulioOK").toString()).catch(() => { })

        if (["cattivo", "che cattivo", "sei cattivo"].includes(content))
            message.react(getEmoji(client, "GiulioCattivo").toString()).catch(() => { })

        if (["auguri", "tanti auguri", "buon compleanno"].includes(content))
            message.react(getEmoji(client, "GiulioFesta").toString()).catch(() => { })

        if (["love", "amore", "ti amo", "i love you", "ti amo tanto"].includes(content))
            message.react(getEmoji(client, "GiulioLove").toString()).catch(() => { })

        if (["lol"].includes(content))
            message.react(getEmoji(client, "GiulioLOL").toString()).catch(() => { })

        if (["oh shit", "oh cazzo", "aiuto", "ho paura", "ho tanta paura"].includes(content))
            message.react(getEmoji(client, "GiulioPaura").toString()).catch(() => { })

        if (["ciao", "hi", "hello", "salve", "ciao a tutti", "salve a tutti"].includes(content))
            message.react(getEmoji(client, "GiulioHi").toString()).catch(() => { })

        if (["gg", "grande", "good game"].includes(content))
            message.react(getEmoji(client, "GiulioGG").toString()).catch(() => { })

        if (["f"].includes(content))
            message.react(getEmoji(client, "GiulioF").toString()).catch(() => { })

        if (["cosa?", "non ho capito", "cosa", "i dont understand"].includes(content))
            message.react(getEmoji(client, "GiulioDomandoso").toString()).catch(() => { })

        if (["buonanotte", "notte", "buona notte", "io vado a dormire", "io vado a nanna", "ho sonno"].includes(content))
            message.react(getEmoji(client, "GiulioBuonanotte").toString()).catch(() => { })

        if (["cool", "figo", "che cool", "che figo"].includes(content))
            message.react(getEmoji(client, "GiulioCool").toString()).catch(() => { })

        if (["ban"].includes(content))
            message.react(getEmoji(client, "GiulioBan").toString()).catch(() => { })

        if (["popcorn", "pop corn", "andiamo al cinema", "vado al cinema", "spettacolo", "mi godo lo spettacolo"].includes(content))
            message.react(getEmoji(client, "GiulioPopCorn").toString()).catch(() => { })

        if (["sus", "sospetto", "è sospetto"].includes(content))
            message.react(getEmoji(client, "GiulioSus").toString()).catch(() => { })

        if (["cringe", "che cringe", "cringissimo"].includes(content))
            message.react(getEmoji(client, "GiulioCringe").toString()).catch(() => { })

        if (["boost", "ho boostato", "fra un po' boosto"].includes(content))
            message.react(getEmoji(client, "GiulioBoost").toString()).catch(() => { })

        if (["easy", "ez", "ezz", "troppo semplice", "troppo easy", "ma è semplice", "ma è facile", "ma non è difficile"].includes(content))
            message.react(getEmoji(client, "GiulioEasy").toString()).catch(() => { })

        if (["figata", "che figata", "non vedo l'ora", "sono gasato", "sono gasatissimo"].includes(content))
            message.react(getEmoji(client, "GiulioGasato").toString()).catch(() => { })

        if (["aiuto", "sos", "ho bisogno di aiuto", "qualcuno mi può aiutare"].includes(content))
            message.react(getEmoji(client, "GiulioHelp").toString()).catch(() => { })

        if (["che vergogna", "mi vergogno", , "sono timido", "sono imbarazzato"].includes(content))
            message.react(getEmoji(client, "GiulioImbarazzato").toString()).catch(() => { })

        if (["che schifo", "che brutto", "fa schifo", "è schifoso", "mi viene il vomito", "fra un po' vomito"].includes(content))
            message.react(getEmoji(client, "GiulioNausea").toString()).catch(() => { })

        if (["ti prego", "dai ti prego", "per favore", "dai per favore"].includes(content))
            message.react(getEmoji(client, "GiulioOcchioloni").toString()).catch(() => { })

        if (["no", "assolutamente no", "ma anche no", "ehm... no"].includes(content))
            message.react(getEmoji(client, "GiulioNo").toString()).catch(() => { })

        if (["si", "assolutamente si"].includes(content))
            message.react(getEmoji(client, "GiulioYes").toString()).catch(() => { })

        if (["sono ricco", "sei ricco", "voglio diventare ricco", "mi è arrivato lo stipendio"].includes(content))
            message.react(getEmoji(client, "GiulioRicco").toString()).catch(() => { })

        if (["sono sconvolto"].includes(content))
            message.react(getEmoji(client, "GiulioSconvolto").toString()).catch(() => { })
    },
};
