global.calcoloXpNecessario = function (level) {
    var xpNecessarioFinoA10 = [0, 50, 110, 160, 200, 280, 450, 750, 1400, 2100]

    if (level < 10) {
        xpNecessario = xpNecessarioFinoA10[level]
    }
    else {
        xpNecessario = (level) * (level) * 50
    }
    return xpNecessario
}

global.setLevelRole = async function (member, level) {
    let ruoloDaAvere = "";
    if (level >= 200)
        ruoloDaAvere = config.ruoliLeveling.level200
    else if (level >= 150)
        ruoloDaAvere = config.ruoliLeveling.level150
    else if (level >= 100)
        ruoloDaAvere = config.ruoliLeveling.level100
    else if (level >= 90)
        ruoloDaAvere = config.ruoliLeveling.level90
    else if (level >= 80)
        ruoloDaAvere = config.ruoliLeveling.level80
    else if (level >= 70)
        ruoloDaAvere = config.ruoliLeveling.level70
    else if (level >= 60)
        ruoloDaAvere = config.ruoliLeveling.level60
    else if (level >= 50)
        ruoloDaAvere = config.ruoliLeveling.level50
    else if (level >= 45)
        ruoloDaAvere = config.ruoliLeveling.level45
    else if (level >= 40)
        ruoloDaAvere = config.ruoliLeveling.level40
    else if (level >= 35)
        ruoloDaAvere = config.ruoliLeveling.level35
    else if (level >= 30)
        ruoloDaAvere = config.ruoliLeveling.level30
    else if (level >= 25)
        ruoloDaAvere = config.ruoliLeveling.level25
    else if (level >= 20)
        ruoloDaAvere = config.ruoliLeveling.level20
    else if (level >= 15)
        ruoloDaAvere = config.ruoliLeveling.level15
    else if (level >= 10)
        ruoloDaAvere = config.ruoliLeveling.level10
    else if (level >= 5)
        ruoloDaAvere = config.ruoliLeveling.level5

    if (ruoloDaAvere != "") {
        if (!member.roles.cache.has(ruoloDaAvere)) {
            await member.roles.add(ruoloDaAvere)
        }
    }

    for (var ruolo in config.ruoliLeveling) {
        if (member.roles.cache.has(config.ruoliLeveling[ruolo]) && config.ruoliLeveling[ruolo] != ruoloDaAvere) {
            await member.roles.remove(config.ruoliLeveling[ruolo])
        }
    }
}