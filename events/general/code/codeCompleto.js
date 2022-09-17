const Discord = require("discord.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("codeCompleto")) return

        await interaction.deferUpdate().catch(() => { })

        let codice = client.codes.find(cmd => cmd.id == interaction.customId.split(",")[1]);

        if (!codice) return interaction.message.delete()

        let attachment = new Discord.MessageAttachment(Buffer.from(codice.code.trim(), 'utf-8'), `${codice.name}-GiulioAndCode.txt`)

        let embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(`${codice.description}
            
_Version: \`Discord.js v14\`_`)

        interaction.user.send({ embeds: [embed], files: [attachment] })
    },
};
