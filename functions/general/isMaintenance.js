const { getServer } = require("../../functions/database/getServer")

const isMaintenance = async (userId) => {
    let serverstats = await getServer()
    const testers = serverstats.testers
    const maintenanceStatus = process.env.isHost == "false" ? serverstats.maintenance?.local : serverstats.maintenance?.host

    if (!userId) {
        if (maintenanceStatus == 0) return false
        else return true
    }

    if (maintenanceStatus == 0) return false

    if (maintenanceStatus == 1)
        if (!testers.includes(userId)) return true

    if (maintenanceStatus == 2) return true

    if (maintenanceStatus == 3)
        if (testers.includes(userId)) return true

}

module.exports = { isMaintenance }