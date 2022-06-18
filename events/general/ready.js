const log = require("../../config/general/log.json");
const settings = require("../../config/general/settings.json");
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { counterChannels } = require("../../functions/server/counterChannels")
const { youtubeNotifications } = require("../../functions/server/youtubeNotifications")
const { autoBackup } = require("../../functions/general/autoBackup");
const { checkBirthday } = require("../../functions/community/birthday/checkBirthday");
const { invites } = require("../../functions/general/invites");
const { ttsInactivity } = require("../../functions/music/tts/ttsQueue");
const { checkActivityPrivateRooms } = require("../../functions/privateRooms/checkActivityPrivateRooms");
const { checkPollTimeout } = require("../../functions/community/poll/checkPollTimeout");
const { checkUnverifedUser } = require("../../functions/general/checkUnverifedUser");
const { checkRoomInDB } = require("../../functions/privateRooms/checkRoomInDB");
const { checkTicketInDB } = require("../../functions/ticket/checkTicketInDB");
const { ttdCounter } = require("../../functions/log/ttdCounter");
const { subtractCommandCooldown } = require("../../index");

module.exports = {
    name: "ready",
    async execute(client) {
        console.log(`-- ${client.user.username} è ONLINE! --`);

        client.user.setActivity('/help', { type: 'WATCHING' });

        if (!isMaintenance()) {
            setInterval(counterChannels, 1000 * 60 * 5, client)
            setInterval(youtubeNotifications, 1000 * 60 * 2, client)
            setInterval(autoBackup, 1000, client)
            setInterval(subtractCommandCooldown, 1000)
            setInterval(checkBirthday, 1000, client)
            setInterval(ttsInactivity, 1000, client)
            setInterval(checkActivityPrivateRooms, 1000 * 10, client)
            setInterval(checkPollTimeout, 1000 * 10, client)
            setInterval(checkUnverifedUser, 1000 * 60, client)
            setInterval(checkRoomInDB, 1000 * 10, client)
            setInterval(checkTicketInDB, 1000 * 10, client)
            setInterval(ttdCounter, 1000 * 60 * 5, client)
        }

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(client.user.id)
        utente?.voice?.disconnect()

        const firstInvites = await client.guilds.cache.get(settings.idServer).invites.fetch()
        invites.set(settings.idServer, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));

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