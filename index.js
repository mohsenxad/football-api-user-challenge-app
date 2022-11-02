const express = require('express');
var bodyParser = require('body-parser')
require('dotenv').config();

const auth = require('football-middleware-authentication-app')(
    process.env.ACCESS_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_SECRET
)

const packageJson = require('./package.json');

var app = express();
app.use(bodyParser.json())

app.use(function(req, res, next) 
    {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, eventid");
        next();
    }
);

const userChallengeServices = require('./src');

app.get('/isAlive', 
    (req, res) => 
        {
            const result = {
                emoji : '😍',
                name: packageJson.name,
                version : packageJson.version
            }
            sendResult(res, result);
        }
);

app.post('/userChallenge/setOption',
    auth.chechAuth,
    async (req, res) =>
        {
            const user = req.user;
            const challengeId = req.body.challengeId;
            const challengeOptionId = req.body.challengeOptionId;

            if(
                user &&
                challengeId &&
                challengeOptionId
            )
                {
                    try 
                        {
                            const userChallengeId = await userChallengeServices.selectChallengeOption(
                                user,
                                req.body
                            );
                            result = {
                                userChallengeId: userChallengeId
                            }
                            sendResult(
                                res,
                                result
                            );
                        }
                    catch (error)
                        {
                            processError(
                                res,
                                error
                            )
                        }
                }
            else
                {
                    const invalidParametesError = new Error("Invalid Parameters");
                    processError(
                        res,
                        invalidParametesError
                    )
                }
        }
)


function sendResult
(
    res,
    data
)
    {
        res.json(data);
    }

function processError(
    res,
    error
)
    {
        console.log(error);
        res.status(400).json(
            {
                message: error.message 
            }
        );
    }

app.listen(packageJson.port,function()
    {
        console.log('Init ' + packageJson.name + ' on ' + packageJson.port);
        console.log('Access URL : http://localhost:' + packageJson.port);
    }
);