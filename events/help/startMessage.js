const Discord = require("discord.js")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")

module.exports = {
    name: "threadCreate",
    async execute(client, thread, newlyCreated) {
        if (!newlyCreated) return

        const maintenanceStatus = await isMaintenance(thread.ownerId)
        if (maintenanceStatus) return

        if (thread.parentId != settings.idCanaliServer.help) return

        let embed = new Discord.MessageEmbed()
            .setColor(colors.orange)
            .addFields([
                {
                    name: ":placard: Dai un titolo significativo",
                    value: "Scegli un titolo completo e chiaro sul tuo problema in modo da essere compreso più facilmente (Modifica il titolo se necessario)"
                },
                {
                    name: ":ok_hand: Descrivi bene il tuo problema",
                    value: "Non limitarti a mandare solo l'errore, ma spiega nel dettaglio cosa stai facendo, perchè, come e quale sia il problema"
                },
                {
                    name: ":bellhop: Cerca di risolvere da solo",
                    value: "Prima di chiedere aiuto prova a trovare la soluzione in autonomia. Cerca nella documentazione o online digitando il tuo problema (anche in inglese per maggiori risultati)"
                },
                {
                    name: ":peace: Rispetta tutti",
                    value: "Nessuno qui ha l'obbligo di aiutarti, rispetta tutti, anche chi non ha voglia di farlo"
                },
                {
                    name: ":microscope: Guarda i vecchi post",
                    value: "Dai un occhiata ai vecchi post degli utenti, sicuramente qualcuno avrà avuto il tuo stesso problema"
                },
                {
                    name: ":confounded: Non cercare disperatamente aiuto",
                    value: "Non chiedere in altri canali di essere aiuto nel tuo post, quando qualcuno avrà voglia e tempo ti aiuterà sicuramente"
                },
                {
                    name: ":heartpulse: Ringrazia gli utenti",
                    value: "Se uno o più utenti ti aiutato, ringraziali con il comando </thankyou:1018431018295902238>"
                }
            ])

        let embed2 = new Discord.MessageEmbed()
            .setColor(colors.red)
            .setDescription(":exclamation: Il non rispetto di queste regole può portare alla **chiusura** del post da parte dello staff")

        thread.send({ embeds: [embed, embed2] })
            .then(msg => {
                msg.pin().catch(() => { })
            })
    }
}
