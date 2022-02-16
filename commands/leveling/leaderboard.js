module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare statistiche ranking del server",
    syntax: "!leaderboard",
    category: "ranking",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var leaderboardListLeveling = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.find(y => y.id == x.id)).sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))
        var leaderboardLeveling = ""

        var totPage = Math.ceil(leaderboardListLeveling.length / 10)
        var page = 1;

        for (var i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListLeveling[i]) {

                switch (i) {
                    case 0:
                        leaderboardLeveling += ":first_place: ";
                        break
                    case 1:
                        leaderboardLeveling += ":second_place: "
                        break
                    case 2:
                        leaderboardLeveling += ":third_place: "
                        break
                    default:
                        leaderboardLeveling += `**#${i + 1}** `
                }

                var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListLeveling[i].id);

                leaderboardLeveling += `${utente.nickname ? utente.nickname : utente.user.username} - **Lvl. ${leaderboardListLeveling[i].level ? leaderboardListLeveling[i].level : 0}** (XP: ${humanize(parseInt(leaderboardListLeveling[i].xp ? leaderboardListLeveling[i].xp : 0), { delimiter: '.', separator: ',' })})\r`
            }
        }

        var leaderboardListEconomy = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.find(y => y.id == x.id)).sort((a, b) => (a.money < b.money) ? 1 : ((b.money < a.money) ? -1 : 0))
        var leaderboardEconomy = ""

        for (var i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListEconomy[i]) {
                switch (i) {
                    case 0:
                        leaderboardEconomy += ":first_place: ";
                        break
                    case 1:
                        leaderboardEconomy += ":second_place: "
                        break
                    case 2:
                        leaderboardEconomy += ":third_place: "
                        break
                    default:
                        leaderboardEconomy += `**#${i + 1}** `
                }

                var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListEconomy[i].id)
                leaderboardEconomy += `${utente.nickname ? utente.nickname : utente.user.username} - **${humanize((leaderboardListEconomy[i].money ? leaderboardListEconomy[i].money : 0), { delimiter: '.', separator: ',' })}$**\r`
            }
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":trophy: Leaderboard :trophy:")
            .setColor("#ffc400")
            .setDescription("Classifiche ranking di tutti gli utenti nel server")
            .setThumbnail(client.guilds.cache.get(settings.idServer).iconURL({ dynamic: true }))
            .addField(":beginner: Leveling", leaderboardLeveling)
            .addField(":coin: Economy", leaderboardEconomy)
            .setFooter(`Page ${page}/${totPage}`)


        var button1 = new Discord.MessageButton()
            .setCustomId(`indietro2Lb,${message.author.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("⏮️")

        var button2 = new Discord.MessageButton()
            .setCustomId(`indietroLb,${message.author.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("◀️")

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        var button3 = new Discord.MessageButton()
            .setCustomId(`avantiLb,${message.author.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("▶️")

        var button4 = new Discord.MessageButton()
            .setCustomId(`avanti2Lb,${message.author.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("⏭️")

        if (page == totPage) {
            button3.setDisabled()
            button4.setDisabled()
        }

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        message.channel.send({ embeds: [embed], components: [row] })
            .catch(() => { })
    },
};