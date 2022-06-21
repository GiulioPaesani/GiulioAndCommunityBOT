const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    id: String,
    username: String,
    roles: Array,
    statistics: Object,
    lastScore: Number,
    bestScore: Number,
    timeLastScore: String,
    timeBestScore: String,
    correct: Number,
    incorrect: Number,
    level: Number,
    xp: Number,
    cooldownXp: String,
    warn: Array,
    moderation: Object,
    inventory: Object,
    joinedAt: String,
    leavedAt: String,
    money: Number,
    birthday: Array,
    wrapped: Object
})

module.exports = model('userstats', UserSchema);