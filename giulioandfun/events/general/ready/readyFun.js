const settings = require("../../../config/general/settings.json");
const log = require("../../../config/general/log.json");
const { newStory } = require("../../../functions/onewordstory/newStory");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { subtractCommandCooldown } = require("../../../index");

module.exports = {
    name: "ready",
    client: "fun",
    async execute(client) {
        console.log(`-- ${client.user.username} è ONLINE! --`);

        client.user.setActivity('/funserver', { type: "PLAYING" });

        client.app.listen(5001, () => {
            console.log(`-- ${client.user.username} in ascolto sulla porta 5001 --`)
        })

        if (!isMaintenance()) {
            setInterval(newStory, 1000, client)
            setInterval(subtractCommandCooldown, 1000)
        }

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(client.user.id)
        utente?.voice?.disconnect()

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