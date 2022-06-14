const fs = require("fs")

const updateServer = (data) => {
    try {
        if (!data) return

        fs.writeFileSync(`../database/server/server.json`, JSON.stringify(data))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { updateServer }