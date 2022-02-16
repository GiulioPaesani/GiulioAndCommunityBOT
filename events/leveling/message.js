module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (!userstatsList) return

        if (message.channel.parentId == settings.idCanaliServer.categoriaAdmin) return

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return

        var data = new Date()
        if (data.getTime() - userstats.cooldownXp > 60000) {
            var boost = 0;
            if (message.member.roles.cache.has(settings.ruoliLeveling.level25)) {
                boost = 10;
            }
            if (message.member.roles.cache.has(settings.ruoliLeveling.level50)) {
                boost = 20;
            }

            userstats.cooldownXp = data.getTime();

            var xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15;

            if (userstats.birthday && ((userstats.birthday[0] == data.getMonth() + 1 && userstats.birthday[1] == data.getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && data.getMonth() == 2 && data.getDate() == 1))) {
                xp = xp * 2
            }

            var userstats = await addXp(userstats, xp, boost);

            userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        }
    },
};