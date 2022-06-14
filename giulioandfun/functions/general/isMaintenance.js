const { getServer } = require("../../functions/database/getServer.js")

const isMaintenance = (userId) => {

    let serverstats = getServer()
    const testers = serverstats.testers
    const maintenanceStates = process.env.isHost == "false" ? serverstats.maintenance.local : serverstats.maintenance.host

    if (!userId) {
        if (maintenanceStates == 0) return false
        else return true
    }

    if (maintenanceStates == 0) return false

    if (maintenanceStates == 1)
        if (!testers.includes(userId)) return true

    if (maintenanceStates == 2) return true

    if (maintenanceStates == 3)
        if (testers.includes(userId)) return true

}

module.exports = { isMaintenance }