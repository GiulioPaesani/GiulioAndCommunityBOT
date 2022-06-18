const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: `voiceStateUpdate`,
    async execute(client, oldMember, newMember) {
        if (isMaintenance(newMember.id)) return

        if (newMember.channelId == settings.idCanaliServer.memberCounter) {
            let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == newMember.id);
            utente.voice.disconnect()
        }
    },
};