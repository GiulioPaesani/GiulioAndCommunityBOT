module.exports = {
    name: "Max listeners",
    aliases: ["eventemitter", "maxlisteners"],
    description: "Possible EventEmitter memory leak detected. 11 message listeners added to [Client]. Use emitter.setMaxListeners() to increase limit",
    info: "Questo errore indica che sono stati creati più di 11 client.on nel vostro codice, non è un vero è proprio errore, ma un semplice avvertimento. Per rimuoverlo definitivamente vi basta scrivere questo testo all'inizio del codice, dove si possono definire i client.on massimi",
    category: "errors",
    id: "1642321315",
    video: "",
    v12: `
require('events').EventEmitter.prototype._maxListeners = 100;`,
    v13: `
require('events').EventEmitter.prototype._maxListeners = 100;`
};
