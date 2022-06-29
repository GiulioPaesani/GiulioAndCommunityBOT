const { getServer } = require('../database/getServer')
const { updateServer } = require('../database/updateServer')

const checkTicketInDB = async (client) => {
    let serverstats = await getServer()
    let changed = false

    serverstats.tickets.forEach(async ticket => {
        if (!client.channels.cache.get(ticket.channel)) {
            serverstats.tickets = serverstats.tickets.filter(x => x.channel != ticket.channel);
            changed = true
        }
    })

    if (changed) updateServer(serverstats)
}

module.exports = { checkTicketInDB }