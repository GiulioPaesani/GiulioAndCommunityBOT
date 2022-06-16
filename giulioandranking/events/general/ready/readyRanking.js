const settings = require("../../../config/general/settings.json");
const log = require("../../../config/general/log.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { subtractCooldown } = require("../../../functions/leveling/cooldownXp");
const { checkLevelRoles } = require("../../../functions/leveling/checkLevelRoles");

module.exports = {
    name: "ready",
    client: "ranking",
    async execute(client) {
        console.log(`-- ${client.user.username} è ONLINE! --`);

        client.user.setActivity('/rank', { type: "WATCHING" });

        client.app.listen(5003, () => {
            console.log(`-- ${client.user.username} in ascolto sulla porta 5003 --`)
        })

        if (!isMaintenance()) {
            setInterval(subtractCooldown, 1000 * 5)
            setInterval(checkLevelRoles, 1000 * 10, client)
        }

        let server = client.guilds.cache.get(settings.idServer)
        let serverLog = client.guilds.cache.get(log.idServer)
        let guildCommands = []
        let guildLogCommands = []
        await server.commands.fetch()
            .then(commands => {
                commands.forEach(command => {
                    guildCommands.push(command)
                    if (!client.commands.get(command.name)) {
                        command.delete()
                    }
                })
            })
        await serverLog.commands.fetch()
            .then(commands => {
                commands.forEach(command => {
                    guildLogCommands.push(command)
                    if (!client.commands.get(command.name)) {
                        command.delete()
                    }
                })
            })

        await client.commands
            .forEach(async command => {
                let data = command.data || {}
                data.name = command.name
                data.description = command.description

                if (!guildCommands.find(x => x.name == command.name))
                    await server.commands.create(data)
                if (!guildLogCommands.find(x => x.name == command.name) && command.otherGuild)
                    await serverLog.commands.create(data)
            })
    }
}