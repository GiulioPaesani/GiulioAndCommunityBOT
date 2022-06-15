const fs = require("fs")

const getServer = () => {
    try {
        let data = JSON.parse(fs.readFileSync('../database/server/server.json', 'utf8'))
        return data
    }
    catch { //? DEBUG
        fs.writeFile('../errorServer.json', fs.readFileSync('../database/server/server.json', 'utf8'), err => {
            if (err) {
                console.error(err);
            }
        });
    }
}

module.exports = { getServer }