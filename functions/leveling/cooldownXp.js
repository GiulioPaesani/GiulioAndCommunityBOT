const cooldownXp = new Map()
const time_now = new Date().toLocaleString();

const subtractCooldown = () => {
    cooldownXp.forEach((cooldown, user) => {
        if (cooldown <= 5) {
            cooldownXp.delete(user)
            /*>*/ console.log(`functions/cooldownXp.js > Rimuovere cooldownXp utente > ${time_now}`);
        }
        else {
            cooldownXp.set(user, cooldown - 5)
            /*>*/ console.log(`functions/cooldownXp.js > Sottrazione 5 cooldownXp utente > ${time_now}`);
        }
    })
}

module.exports = { cooldownXp, subtractCooldown }