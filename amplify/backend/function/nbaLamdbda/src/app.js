/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const nba = require('nba-api-client');
const cors = require('cors')

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "nba";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "teamID";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/nba";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(cors())
// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header(  "Access-Control-Allow-Methods","OPTIONS,POST,GET")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
* HTTP Get method to list objects *
************************************/
app.get(path, async function(req, res) {
  try {
    const defense = await nba.leagueTeamDefenseStats({TeamID:1610612737})
    res.json(defense.LeagueDashPtTeamDefend);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});
/************************************
 * HTTP Get method to 스케쥴 & 라인업 *
 ************************************/
app.post(path+'/main', async function(req, res) {
  // console.log(req.body.date);
  try {
    const today_list = []
    const a = await nba.schedule(req.body.date)
    for(const value of a['data']){
      let tmp_dict = {}
      const home_lineup = await nba.teamRoster({TeamID:nba.getTeamID(value.home_team.full_name).TeamID})
      const away_lineup = await nba.teamRoster({TeamID:nba.getTeamID(value.visitor_team.full_name).TeamID})
      // player['HeadShot']= nba.getPlayerHeadshotURL({TeamID:player.TeamID,PlayerID:player.PLAYER_ID})
      tmp_dict['home_team'] = value.home_team.full_name
      tmp_dict['away_team'] = value.visitor_team.full_name
      tmp_dict['home_team_lineup']  = home_lineup.CommonTeamRoster
      tmp_dict['away_team_lineup']  = away_lineup.CommonTeamRoster
      
      today_list.push(tmp_dict)
    }
    res.json(today_list);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});
app.post('/synergy', async function(req, res) {
  // console.log(req.body.teamId);
  const teamId = parseInt(req.body.teamId)
  try {
    const playType = ['Isolation','Transition','PRBallHandler','PRRollman'
    ,'Spotup','Cut','OffScreen','Handoff']
      const teamPlayType = {}
      for(const type of playType){
        const offense = await nba.synergyTeam({PlayType:type,TypeGrouping:"offensive"})
        const defense = await nba.synergyTeam({PlayType:type,TypeGrouping:"defensive"})
        const data_off = Object.values(offense.SynergyPlayType).filter(res=>res.TEAM_ID===teamId)[0]
        const data_def = Object.values(defense.SynergyPlayType).filter(res=>res.TEAM_ID===teamId)[0]
        teamPlayType[type] = {
          'ppp_off':data_off.PPP,
          'pct_off':data_off.PERCENTILE,
          'poss_off':data_off.POSS_PCT,
          'ppp_def':data_def.PPP,
          'pct_def':data_def.PERCENTILE,
          'poss_def':data_def.POSS_PCT,
        }
      }
    res.json(teamPlayType);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

app.post('/offense', async function(req, res) {
  const teamId = parseInt(req.body.teamId)
  try {
    const teamOffenseType = {}
    const attackParam = [ 
      "Overall",
      "Catch and Shoot",
      "Pullups",
      "Less Than 10 ft",
    ]
    for(const att of attackParam){
      const data = await nba.leagueTeamShootingStats({GeneralRange:att,TeamID:teamId})
      teamOffenseType[att] = {
        'FGA_FREQUENCY': data.LeagueDashPTShots.FGA_FREQUENCY,
        'FGM' : data.LeagueDashPTShots.FGM,
        'FGA' : data.LeagueDashPTShots.FGA,
        'FG_PCT' : data.LeagueDashPTShots.FG_PCT,
        'FG2A_FREQUENCY' : data.LeagueDashPTShots.FG2A_FREQUENCY,
        'FG2M' : data.LeagueDashPTShots.FG2M,
        'FG2A' : data.LeagueDashPTShots.FG2A,
        'FG2_PCT' : data.LeagueDashPTShots.FG2_PCT,
        'FG3A_FREQUENCY' : data.LeagueDashPTShots.FG3A_FREQUENCY,
        'FG3M' : data.LeagueDashPTShots.FG2M,
        'FG3A' : data.LeagueDashPTShots.FG2A,
        'FG3_PCT' : data.LeagueDashPTShots.FG2_PCT,
      }
    }
    const drive = await nba.leagueTeamTrackingStats({PtMeasureType:"Drives",TeamID:teamId})
    teamOffenseType['Drives'] = {
      'DRIVES': drive.LeagueDashPtStats.DRIVES,
      'DRIVE_FGM': drive.LeagueDashPtStats.DRIVE_FGM,
      'DRIVE_FGA': drive.LeagueDashPtStats.DRIVE_FGA,
      'DRIVE_FG_PCT': drive.LeagueDashPtStats.DRIVE_FG_PCT
    }
    const speed = await nba.leagueTeamTrackingStats({PtMeasureType:"SpeedDistance",TeamID:teamId})
    teamOffenseType['SpeedDistance'] = {
      'DIST_MILES': speed.LeagueDashPtStats.DIST_MILES,
      'AVG_SPEED': speed.LeagueDashPtStats.AVG_SPEED
    }
    res.json(teamOffenseType);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

app.post('/defense', async function(req, res) {
  const teamId = parseInt(req.body.teamId)
  try {
    const teamDefenseType = {}

    const defense = await nba.leagueTeamDefenseStats({TeamID:teamId})
    teamDefenseType['DefenseEff'] = {
      'PCT_PLUSMINUS' : defense.LeagueDashPtTeamDefend.PCT_PLUSMINUS,
    }
    const rimProtect = await nba.leagueTeamTrackingStats({PtMeasureType:"Defense",TeamID:teamId})
    teamDefenseType['DriveProtect'] = {
      'DEF_RIM_FGM' : rimProtect.LeagueDashPtStats.DEF_RIM_FGM,
      'DEF_RIM_FGA' : rimProtect.LeagueDashPtStats.DEF_RIM_FGA,
      'DEF_RIM_FG_PCT' : rimProtect.LeagueDashPtStats.DEF_RIM_FG_PCT,
    }
    const defenseParam = [ 
      "Overall",
      "Catch and Shoot",
      "Pullups",
      "Less Than 10 ft",
    ]
    for(const defense of defenseParam){
      const data = await nba.leagueTeamOpponentShooting({TeamID:teamId,DefenseCategory:defense})
      teamDefenseType[defense] = {
        'FGA_FREQUENCY': data.LeagueDashPTShots.FGA_FREQUENCY,
        'FGM' : data.LeagueDashPTShots.FGM,
        'FGA' : data.LeagueDashPTShots.FGA,
        'FG_PCT' : data.LeagueDashPTShots.FG_PCT,
        'FG2A_FREQUENCY' : data.LeagueDashPTShots.FG2A_FREQUENCY,
        'FG2M' : data.LeagueDashPTShots.FG2M,
        'FG2A' : data.LeagueDashPTShots.FG2A,
        'FG2_PCT' : data.LeagueDashPTShots.FG2_PCT,
        'FG3A_FREQUENCY' : data.LeagueDashPTShots.FG3A_FREQUENCY,
        'FG3M' : data.LeagueDashPTShots.FG2M,
        'FG3A' : data.LeagueDashPTShots.FG2A,
        'FG3_PCT' : data.LeagueDashPTShots.FG2_PCT,
      }
    }
    res.json(teamDefenseType);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});
app.post('/offensev2', async function(req, res) {
  const teamId = parseInt(req.body.teamId)
  try {
    const teamOffenseV2 = {}
    const a = await nba.teamShootingSplits({TeamID:teamId})
    for(const data in a.ShotAreaTeamDashboard){
      teamOffenseV2[a.ShotAreaTeamDashboard[data].GROUP_VALUE]=a.ShotAreaTeamDashboard[data]
      delete teamOffenseV2[a.ShotAreaTeamDashboard[data].GROUP_VALUE].GROUP_SET
      delete teamOffenseV2[a.ShotAreaTeamDashboard[data].GROUP_VALUE].GROUP_VALUE
    }
    const b = await nba.leagueTeamGeneralStats({TeamID:teamId})
    teamOffenseV2['Normal'] = b.LeagueDashTeamStats
    const c = await nba.leagueTeamGeneralStats({TeamID:teamId,MeasureType:"Advanced"})
    teamOffenseV2['Advanced'] = c.LeagueDashTeamStats
    
    // console.log(teamOffenseV2);
    res.json(teamOffenseV2);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

app.post('/h2h', async function(req, res) {
  const teamId = parseInt(req.body.teamId)
  const teamIdOpp = parseInt(req.body.teamIdOpp)
  try {
    const h2hData = {}
    const h2hGeneralTeam = await nba.leagueTeamGeneralStats({TeamID:teamId,OpponentTeamID:teamIdOpp})
    const h2hAdvanceTeam = await nba.leagueTeamGeneralStats({TeamID:teamId,OpponentTeamID:teamIdOpp,MeasureType:'Advanced'})
    
    const h2hPlayers = {}
    const h2hGeneralPlayer = await nba.leaguePlayerGeneralStats({TeamID:teamId,OpponentTeamID:teamIdOpp})
    for(const player in h2hGeneralPlayer.LeagueDashPlayerStats){
     h2hPlayers[h2hGeneralPlayer.LeagueDashPlayerStats[player].PLAYER_NAME] = h2hGeneralPlayer.LeagueDashPlayerStats[player]
    }
    
    const h2hPlayersAdv = {}
    const h2hGeneralPlayerAdv = await nba.leaguePlayerGeneralStats({TeamID:teamId,OpponentTeamID:teamIdOpp,MeasureType:'Advanced'})
    for(const player in h2hGeneralPlayerAdv.LeagueDashPlayerStats){
     h2hPlayersAdv[h2hGeneralPlayerAdv.LeagueDashPlayerStats[player].PLAYER_NAME] = h2hGeneralPlayerAdv.LeagueDashPlayerStats[player]
    }
 
    h2hData['GeneralTeam'] = h2hGeneralTeam.LeagueDashTeamStats
    h2hData['AdvanceTeam'] = h2hAdvanceTeam.LeagueDashTeamStats
    h2hData['GeneralPlayer'] = h2hPlayers
    h2hData['AdvancePlayer'] = h2hPlayersAdv
 
    // console.log(h2hData);
    // console.log(teamOffenseV2);
    res.json(h2hData);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});
app.post('/last3', async function(req, res) {
  const teamId = parseInt(req.body.teamId)
  try {
    const last3Games = {}

    const last3GameGeneral = await nba.leagueTeamGeneralStats({TeamID:teamId,LastNGames:3})
    const last3GameAdvance = await nba.leagueTeamGeneralStats({TeamID:teamId,LastNGames:3,MeasureType:'Advanced'})
    
    const last3GamePlayers = {}
    const last3GameGeneralPlayer = await nba.leaguePlayerGeneralStats({TeamID:teamId,LastNGames:3})
    for(const player in last3GameGeneralPlayer.LeagueDashPlayerStats){
      last3GamePlayers[last3GameGeneralPlayer.LeagueDashPlayerStats[player].PLAYER_NAME] = last3GameGeneralPlayer.LeagueDashPlayerStats[player]
    }
    
    const last3GamePlayersAdv = {}
    const last3GameGeneralPlayerAdv = await nba.leaguePlayerGeneralStats({TeamID:teamId,LastNGames:3,MeasureType:'Advanced'})
    for(const player in last3GameGeneralPlayerAdv.LeagueDashPlayerStats){
      last3GamePlayersAdv[last3GameGeneralPlayerAdv.LeagueDashPlayerStats[player].PLAYER_NAME] = last3GameGeneralPlayerAdv.LeagueDashPlayerStats[player]
    }
  
    last3Games['GeneralTeam'] = last3GameGeneral.LeagueDashTeamStats
    last3Games['AdvanceTeam'] = last3GameAdvance.LeagueDashTeamStats
    last3Games['GeneralPlayer'] = last3GamePlayers
    last3Games['AdvancePlayer'] = last3GamePlayersAdv
    
    res.json(last3Games);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

app.get('/teamsplit', async function(req, res) {
  try {
    const teamSplit = await nba.teamGeneralSplits({TeamID:1610612744})
    delete teamSplit.PrePostAllStarTeamDashboard
  
    //////////// 여기있는 Keys를 사용해서 데이터 접근하기~~~ /////////
    // console.log(teamSplit.DaysRestTeamDashboard);
    // console.log(teamSplit.LocationTeamDashboard);
    // console.log(teamSplit.MonthTeamDashboard);
    // console.log(teamSplit.OverallTeamDashboard);
    // console.log(teamSplit.WinsLossesTeamDashboard);
    /////////////////////////////////////////////////////////
    res.json(teamSplit);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});




























/************************************
 * HTTP Get method to query objects *
 ************************************/

app.get(path + hashKeyPath, async function(req, res) {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  try {
    const data = await ddbDocClient.send(new QueryCommand(queryParams));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, async function(req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    const data = await ddbDocClient.send(new GetCommand(getItemParams));
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.json(data) ;
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, async function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'put call succeed!', url: req.url, data: data })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, async function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'post call succeed!', url: req.url, data: data })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, async function(req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    let data = await ddbDocClient.send(new DeleteCommand(removeItemParams));
    res.json({url: req.url, data: data});
  } catch (err) {
    res.statusCode = 500;
    res.json({error: err, url: req.url});
  }
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
