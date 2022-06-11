module.exports = {
    name: "MySQL",
    aliases: ["sql"],
    description: "Comandi principali del database MySQL",
    category: "utility",
    id: "1654680027",
    link: "https://www.toptal.com/developers/hastebin/uniwuqiyim.sql",
    info: "Prima di utilizzare i comandi è ovviamente necessario trovare un servizio di hosting e creare il database vero e proprio",
    video: "https://youtu.be/6D69VJhVfsY",
    code: `
//Creare una tabella:
CREATE TABLE userstats(
    id VARCHAR(30),
    username VARCHAR(50),
    totMessage INT
);

//Eliminare una tabella
DROP TABLE userstats;

//ggiungere una riga
INSERT INTO serverstats VALUES ('idUtente','tagUtente',1234);

//Aggiungere una colonna (a una tabella gia esistente)
ALTER TABLE userstats ADD bestScore INT;

//Rimuovere una riga
DELETE FROM userstats WHERE id = 'idUtente';

//Rimuovere una colonna
ALTER TABLE userstats DROP COLUMN bestScore;

//Modificare una riga
UPDATE userstats SET totalMessage = 1215, bestScore = 32 WHERE id = 'idUtente';`
};
