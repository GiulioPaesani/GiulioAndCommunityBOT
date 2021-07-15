module.exports = {
    name: "errore1",
    aliases: ["eventemitter","maxlisteners","error1"],
    description: "Possible EventEmitter memory leak detected. 11 message listeners added to [Client]. Use emitter.setMaxListeners() to increase limit",
    info: "Questo errore indica che sono stati creati più di 11 client.on nel vostro codice, non è un vero è proprio errore, ma un semplice avvertimento. Per rimuoverlo definitivamente vi basta scrivere questo testo all'inizio del codice, dove si possono definire i client.on massimi",
    video: "",
    code: `
require('events').EventEmitter.prototype._maxListeners = 100;`
};
