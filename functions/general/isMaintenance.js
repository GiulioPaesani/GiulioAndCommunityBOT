const isMaintenance = (userId) => {

    let serverstats = { testers: ["793768313934577664"] }
    const testers = serverstats.testers
    // const maintenanceStates = process.env.isHost == "false" ? serverstats.maintenance?.local : serverstats.maintenance?.host
    const maintenanceStates = 0

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