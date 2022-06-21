const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    id: String,
    username: String,
    roles: Array,
    joinedAt: String,
    leavedAt: String,
    birthday: Array,
    counting: {
        lastScore: Number,
        bestScore: Number,
        timeLastScore: String,
        timeBestScore: String,
        correct: Number,
        incorrect: Number,
        streak: Number,
        updated: Number,
        deleted: Number
    },
    countingplus: {
        lastScore: Number,
        timeLastScore: String,
        correct: Number,
        incorrect: Number,
        streak: Number,
        updated: Number,
        deleted: Number
    },
    onewordstory: {
        totWords: Number,
        totWordsToday: Number,
        totStories: Number
    },
    leveling: {
        level: Number,
        xp: Number,
        livelliSuperati: Object
    },
    economy: {
        money: Number,
        inventory: Object
    },
    moderation: Object,
    warns: Array,
    invites: Object
})

module.exports = model('users', UserSchema);