const fs = require("fs")

const updateServerStats = (data) => {
    try {
        if (!data) return

        fs.writeFileSync(`./database/server/serverStats.json`, JSON.stringify(data))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { updateServerStats }