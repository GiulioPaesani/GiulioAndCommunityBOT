const { getServer } = require('../database/getServer')
const { updateServer } = require('../database/updateServer')

const checkTicketInDB = async (client) => {
    let serverstats = getServer()
    let changed = false

    for (let index in serverstats.tickets) {
        let ticket = serverstats.tickets[index]

        if (!client.channels.cache.get(ticket.channel)) {
            serverstats.tickets = serverstats.tickets.filter(x => x.channel != ticket.channel);
            changed = true
        }
    }

    if (changed) updateServer(serverstats)
}

module.exports = { checkTicketInDB }