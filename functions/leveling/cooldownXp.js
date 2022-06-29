const cooldownXp = new Map()

const subtractCooldown = () => {
    cooldownXp.forEach((cooldown, user) => {
        if (cooldown <= 5) {
            cooldownXp.delete(user)
        }
        else {
            cooldownXp.set(user, cooldown - 5)
        }
    })
}

module.exports = { cooldownXp, subtractCooldown }