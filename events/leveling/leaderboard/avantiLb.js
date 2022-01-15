module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("avantiLb")) return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var leaderboardListLeveling = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.find(y => y.id == x.id)).sort((a, b) => (a.xp < b.xp) ? 1 : ((b.xp < a.xp) ? -1 : 0))
        var leaderboardLeveling = ""

        var totPage = Math.ceil(leaderboardListLeveling.length / 10)
        var page = parseInt(button.id.split(",")[2]) + 1;
        if (page > totPage) return

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

                var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListLeveling[i].id)
                leaderboardLeveling += `${utente.nickname ? utente.nickname : utente.user.username} - **Lev. ${leaderboardListLeveling[i].level ? leaderboardListLeveling[i].level : 0}** (XP: ${humanize(parseInt(leaderboardListLeveling[i].xp ? leaderboardListLeveling[i].xp : 0), { delimiter: '.', separator: ',' })})\r`
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

        var button1 = new disbut.MessageButton()
            .setID(`indietro2Lb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("⏮️")

        var button2 = new disbut.MessageButton()
            .setID(`indietroLb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("◀️")

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        var button3 = new disbut.MessageButton()
            .setID(`avantiLb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("▶️")

        var button4 = new disbut.MessageButton()
            .setID(`avanti2Lb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("⏭️")

        if (page == totPage) {
            button3.setDisabled()
            button4.setDisabled()
        }

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)
            .addComponent(button3)
            .addComponent(button4)

        button.message.edit(embed, row)
    },
};