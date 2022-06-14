const fs = require("fs")
const settings = require("../../config/general/settings.json")

const getAllUsers = (client, onlyInGuild = true) => {
    try {
        let data = []

        const commandsFolder = fs.readdirSync("../database/users");
        for (const folder of commandsFolder) {
            if (onlyInGuild) {
                if (client.guilds.cache.get(settings.idServer).members.cache.get(folder)) {
                    data.push(JSON.parse(fs.readFileSync(`../database/users/${folder}/${folder}.json`, 'utf8')))
                }
            }
            else {
                data.push(JSON.parse(fs.readFileSync(`../database/users/${folder}/${folder}.json`, 'utf8')))
            }
        }
        return data
    }
    catch { }
}

module.exports = { getAllUsers }