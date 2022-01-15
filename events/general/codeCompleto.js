module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (isMaintenance(button.clicker.user.id)) return

        if (!button.id.startsWith("codeCompleto")) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var version = button.id.split(",")[3];

        var codice = client.codes.find(cmd => cmd.id == button.id.split(",")[2]);

        var attachment = new Discord.MessageAttachment(Buffer.from(codice["v" + version].trim(), 'utf-8'), `${codice.name} v${version} - GiulioAndCode.txt`)

        var embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(codice.description + "\r_Version: `Discord.js v13`_")

        button.clicker.user.send({ embed, files: [attachment] })
            .catch(() => { })
    },
};
