module.exports = {
    name: "MongoDB",
    aliases: ["mongo"],
    description: "Comandi principali del database MongoDB",
    category: "utility",
    id: "1654680035",
    link: "https://www.toptal.com/developers/hastebin/erivokudim.js",
    info: "Prima di utilizzare i comandi è ovviamente necessario trovare un servizio di hosting e creare il database vero e proprio",
    video: "https://youtu.be/UdwRyynj_Bk",
    code: `
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://username:password@clustergiulioandcode.xqwnr.mongodb.net/test";

//Creare un database o collection
MongoClient.connect(url, function (err, db) {
    const dbo = db.db("nomeDatabase"); //Se non c'è lo crea
    dbo.createCollection("nomeCollection", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

//Aggiungere un elemento (una riga) in una collection ->  insertOne()
MongoClient.connect(url, function (err, db) {
    const dbo = db.db("nomeDatabase");
    dbo.collection("nomeCollection").insertOne({ id: "848463685374443530", username: "usbo", level: 2 }, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});

//Trovare i risultati -> .find()
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("nomeDatabase");
    dbo.collection("nomeCollection").find(/*Filtro (come {level: 3})*/).toArray(function (err, result) { //Se nel filtro non si mette nulla allora result sarà tutta la collection, altrimenti sono gli elementi trovati dal filtro
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

//Ordinare i risultati -> .sort()
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("nomeDatabase");
    const mysort = { username: -1 }; //1 = CRESCENTE o -1 = DECRESCENTE
    dbo.collection("nomeCollection").find().sort(mysort).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

//Cancellare un riga -> .deleteOne()
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("nomeDatabase");
    dbo.collection("nomeCollection").deleteOne({ username: "GiulioAndCode" }, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
    });
});

//Modificare un valore -> .updateOne()
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("nomeDatabase");
    const myquery = { username: "nomeUtente" };
    const newvalues = { $set: { username: "gianni", level: 5 } };
    dbo.collection("nomeCollection").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
    });
});`
};