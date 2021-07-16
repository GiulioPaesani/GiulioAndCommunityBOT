module.exports = {
    name: "stato",
    aliases: ["statobot", "status", "statusbot"],
    description: "Settare lo **stato** del proprio bot (Es. Sta giocando a !help)",
    info: "",
    video: "",
    code: `
client.on('ready', () => {
    //Stato classico (Sta guardando..., Sta giocando a...)
    client.user.setActivity('Testo', { type: 'WATCHING' }); //Oppure LISTENING, PLAYING
    //Streamimg
    client.user.setActivity("Testo", {
        type: "STREAMING",
        url: "https://www.twitch.tv/nomeutente"
    });
    //Stato online/offine/non disturbare...
    client.user.setStatus('online') //Oppure idle, dnd, invisible
})`
};
