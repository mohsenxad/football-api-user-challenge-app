const models = require('../models');

module.exports = function buildSelectChallengeOption
(
    dataAccess
)
    {
        return async function selectChallengeOption
        (
            user,
            body
        )
            {
                
                const userChallengeInfo = {
                    user: user,
                    challenge : body.challengeId,
                    challengeOption : body.challengeOptionId
                }

                const userChallenge = models.makeUserChallenge(
                    userChallengeInfo
                );

                const foundUserChallenge = await dataAccess.dataApi.getUserChallengeByUserAndChallenge(
                    userChallenge.getUser(),
                    userChallenge.getChallenge()
                );

                console.log(foundUserChallenge);

                if
                (
                    foundUserChallenge
                )
                    {
                        const userHadSelectOptionError = new Error('شما قبلا در این رقابت شرکت کرده اید.');
                        throw userHadSelectOptionError;

                    }
                else
                    {
                        const userChallengeId = await dataAccess.dataApi.addUserChallenge(
                            userChallenge
                        );
        
                        return userChallengeId;
                    }

                

            }
    }