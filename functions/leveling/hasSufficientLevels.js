const settings = require("../../config/general/settings.json")
const time_now = new Date().toLocaleString();

const hasSufficientLevels = (client, userstats, level) => {
    let server = client.guilds.cache.get(settings.idServer); /*>*/ console.log(`functions/hasSufficientLevels.js > Ottengo guild > ${time_now}`);

    if (userstats.leveling.level >= level) return true

     /*>*/ console.log(`functions/hasSufficientLevels.js > Sto prendendo il membro, e controllo se è Serverbooster > ${time_now}`);

    if (level <= 30 && server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloServerBooster)) return true

    /*>*/ console.log(`functions/hasSufficientLevels.js > Sto prendendo il membro, e controllo se è GiulioSubPlus > ${time_now}`);
    if (level <= 60 && server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloGiulioSubPlus)) return true

     /*>*/ console.log(`functions/hasSufficientLevels.js > Sto prendendo il membro, e controllo se è GiulioGiulioPro > ${time_now}`);
    if (server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloGiulioSubPro)) return true

    return false
}

module.exports = { hasSufficientLevels }