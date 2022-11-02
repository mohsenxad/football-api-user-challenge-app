const buildMakeUserChallenge = require('./user-challenge');

const makeUserChallenge = buildMakeUserChallenge();

module.exports = Object.freeze(
    {
        makeUserChallenge
    }
)