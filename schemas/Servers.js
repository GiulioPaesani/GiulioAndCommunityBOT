const { Schema, model } = require('mongoose');

const ServerSchema = new Schema({
    "counting": {
        "number": Number,
        "user": String,
        "lastUser": String,
        "lastScore": Number,
        "bestScore": Number,
        "timeLastScore": String,
        "timeBestScore": String,
        "lastMessage": String,
        "correct": Number,
        "incorrect": Number,
        "updated": Number,
        "deleted": Number
    },
    "countingplus": {
        "number": Number,
        "operator": String,
        "gap": Number,
        "user": String,
        "lastUser": String,
        "lastScore": Number,
        "timeLastScore": String,
        "lastMessage": String,
        "correct": Number,
        "incorrect": Number,
        "updated": Number,
        "deleted": Number
    },
    "onewordstory": {
        "words": Array,
        "totWords": Number,
        "totWordsToday": Number,
        "totStories": Number,
        "lastMessage": String
    },
    "maintenance": {
        "host": Number,
        "local": Number
    },
    "tickets": Array,
    "privateRooms": Array,
    "ttsDefaultLanguage": String,
    "testers": Array
})

module.exports = model('servers', ServerSchema);