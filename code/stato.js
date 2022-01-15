module.exports = {
    name: "Stato",
    aliases: ["statobot", "status", "statusbot"],
    description: "Settare lo **stato** del proprio bot (Es. Sta giocando a !help)",
    category: "utility",
    id: "1639466250",
    info: "",
    video: "",
    v12: `
client.on('ready', () => {
    //Stato classico (Sta guardando..., Sta giocando a...)
    client.user.setActivity('Testo', { type: 'WATCHING' }); //Oppure LISTENING, PLAYING
    //Streamimg
    client.user.setActivity("Testo", {
        type: "STREAMING",
        url: "https://www.twitch.tv/nomeutente"
    });
    //Stato online/offine/non disturbare... (Potrebbe volerci qualche tempo per doversi settare)
    client.user.setStatus('online') //Oppure idle, dnd, invisible
})`,
    v13: `
client.on('ready', () => {
    //Stato classico (Sta guardando..., Sta giocando a...)
    client.user.setActivity('Testo', { type: 'WATCHING' }); //Oppure LISTENING, PLAYING
    //Streamimg
    client.user.setActivity("Testo", {
        type: "STREAMING",
        url: "https://www.twitch.tv/nomeutente"
    });
    //Stato online/offine/non disturbare... (Potrebbe volerci qualche tempo per doversi settare)
    client.user.setStatus('online') //Oppure idle, dnd, invisible
})`
};
