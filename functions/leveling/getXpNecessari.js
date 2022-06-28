const time_now = new Date().toLocaleString();

const getXpNecessari = (level) => {
    let xp = 0;

    for (let i = 0; i <= level; i++) {
        xp += 50 * i
        if (i > 15)
            xp += 40 * (i - 15)
    }
    /*>*/ console.log(`functions/getXpNecessari.js > Calcolo XP necessari > ${time_now}`);

    return xp
}

module.exports = { getXpNecessari }