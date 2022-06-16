const settings = require("../../../config/general/settings.json");
const log = require("../../../config/general/log.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { checkModRoles } = require("../../../functions/moderation/checkModRoles");
const { checkModeration } = require("../../../functions/moderation/checkModeration");
const { subtractCommandCooldown } = require("../../../index");

module.exports = {
    name: "ready",
    client: "moderation",
    async execute(client) {
        console.log(`-- ${client.user.username} è ONLINE! --`);

        client.user.setActivity('/infractions', { type: "WATCHING" });

        client.app.listen(5002, () => {
            console.log(`-- ${client.user.username} in ascolto sulla porta 5002 --`)
        })

        if (!isMaintenance()) {
            setInterval(checkModRoles, 1000 * 10, client)
            setInterval(checkModeration, 1000 * 60, client)
            setInterval(subtractCommandCooldown, 1000)
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