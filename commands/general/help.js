module.exports = {
    name: "help",
    aliases: ["aiuto", "comandi", "h"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Lista completa dei comandi del bot",
    syntax: "!help",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle(":robot: ALL COMMANDS :robot:")
            .setDescription(`Tutti i **comandi** disponibili all'interno di <@${settings.idBot}>
            
**Prefisso** del bot: \`!\``)
            .addField("Categorie", `
I comandi sono divisi nelle seguenti categorie:
:ferris_wheel: General
:bulb: Community
:bar_chart: Statistics
:joy: Fun
:dollar: Ranking    
:police_officer: Moderation
:closed_lock_with_key: Private rooms

_Seleziona la categoria dal menù qua sotto_`)
            .addField("Tags", utenteMod(message.author) ?
                `
<:AdminTag:905795087903109171> - Il comando è disponibile solo dallo staff amministratore
<:DmTag:905795088171540500> - Il comando è disponibile anche nei DM del bot
` :
                `
<:DmTag:905795088171540500> - Il comando è disponibile anche nei DM del bot
`)

        var select = new Discord.MessageSelectMenu()
            .setCustomId(`helpMenu,${message.author.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "General",
                emoji: "🎡",
                value: "helpGeneral",
                description: "!test, !help, !github, !youtube..."
            })
            .addOptions({
                label: "Community",
                emoji: "💡",
                value: "helpCommunity",
                description: "!suggest, !tclose, !tadd..."
            })
            .addOptions({
                label: "Statistics",
                emoji: "📊",
                value: "helpStatistics",
                description: "!userstats, !avatar, !channelinfo..."
            })
            .addOptions({
                label: "Fun",
                emoji: "😂",
                value: "helpFun",
                description: "!say, !cuser, !cserver..."
            })
            .addOptions({
                label: "Ranking",
                emoji: "💵",
                value: "helpRanking",
                description: "!rank, !lb..."
            })
            .addOptions({
                label: "Moderation",
                emoji: "👮",
                value: "helpModeration",
                description: "!kick, !mute, !infractions, !warn..."
            })
            .addOptions({
                label: "Private rooms",
                emoji: "🔐",
                value: "helpPrivateRooms",
                description: "!pclose, !padd, !premove, !prename..."
            })

        var row = new Discord.MessageActionRow()
            .addComponents(select)

        message.channel.send({ embeds: [embed], components: [row] })
            .catch(() => { })
    },
};