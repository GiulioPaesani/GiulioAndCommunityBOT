const Servers = require("../../schemas/Servers");
const fs = require("fs")

const getServer = async () => {
    let data = JSON.parse(fs.readFileSync('./database/server/server.json', 'utf8'))

    return data
}

module.exports = { getServer }