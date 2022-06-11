const badwords = require("../../config/moderation/badwords.json")

const checkBadwords = (content) => {
    content = content.toLowerCase()
    content = content.replace(/\_/g, "")
    content = content.replace(/\*/g, "")
    content = content.replace(/\`/g, "")
    content = content.replace(/\~\~/g, "")
    content = content.replace(/\|\|/g, "")

    let trovata = false;
    let censurato = content;
    let nonCensurato = content;

    badwords.forEach(parolaccia => {
        if (content.includes(parolaccia)) {
            trovata = true;
            nonCensurato = nonCensurato.replace(eval(`/${parolaccia}/g`), `**${parolaccia}**`)

            let aiLatiDaNonCensurare = Math.floor(Math.floor(parolaccia.length) / 3);

            let parolaCensurata = parolaccia.slice(0, -1 * (parolaccia.length - aiLatiDaNonCensurare)) + '#'.repeat(parolaccia.length - aiLatiDaNonCensurare - aiLatiDaNonCensurare) + parolaccia.slice(parolaccia.length - aiLatiDaNonCensurare)

            censurato = censurato.replace(eval(`/${parolaccia}/g`), `**${parolaCensurata}**`)
        }
    })

    return [trovata, nonCensurato, censurato]
}

module.exports = { checkBadwords }