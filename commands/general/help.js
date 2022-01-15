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

        let option1 = new disbut.MessageMenuOption()
            .setLabel('General')
            .setEmoji('🎡')
            .setValue('helpGeneral')
            .setDescription('!test, !help, !github, !youtube...')
        let option2 = new disbut.MessageMenuOption()
            .setLabel('Community')
            .setEmoji('💡')
            .setValue('helpCommunity')
            .setDescription('!suggest, !tclose, !tadd...')
        let option3 = new disbut.MessageMenuOption()
            .setLabel('Statistics')
            .setEmoji('📊')
            .setValue('helpStatistics')
            .setDescription('!userstats, !avatar, !channelinfo...')
        let option4 = new disbut.MessageMenuOption()
            .setLabel('Fun')
            .setEmoji('😂')
            .setValue('helpFun')
            .setDescription('!say, !cuser, !cserver...')
        let option5 = new disbut.MessageMenuOption()
            .setLabel('Ranking')
            .setEmoji('💵')
            .setValue('helpRanking')
            .setDescription('!rank, !lb...')
        let option6 = new disbut.MessageMenuOption()
            .setLabel('Moderation')
            .setEmoji('👮')
            .setValue('helpModeration')
            .setDescription('!kick, !mute, !infractions, !warn...')
        let option7 = new disbut.MessageMenuOption()
            .setLabel('Private rooms')
            .setEmoji('🔐')
            .setValue('helpPrivateRooms')
            .setDescription('!pclose, !padd, !premove, !prename...')

        let select = new disbut.MessageMenu()
            .setID(`helpMenu,${message.author.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOption(option1)
            .addOption(option2)
            .addOption(option3)
            .addOption(option4)
            .addOption(option5)
            .addOption(option6)
            .addOption(option7)

        message.channel.send(embed, select)
            .catch(() => { return })
    },
};