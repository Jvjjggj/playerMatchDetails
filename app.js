const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "cricketMatchDetails.db");
let db = null;
const connectDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3004, () => {
      console.log("Server Is Running");
    });
  } catch (error) {
    console.log(`DB Erroe ${error.message}`);
  }
};

connectDBAndServer();

const playerDetailsFormat = (i) => {
  return {
    playerId: i.player_id,
    playerName: i.player_name,
  };
};

//API 1
app.get("/players/", async (request, response) => {
  const query = `
    select * from player_details;`;
  const dbresponse = await db.all(query);
  let lst = [];
  for (let i of dbresponse) {
    const change = playerDetailsFormat(i);
    lst.push(change);
  }
  response.send(lst);
});

// API 2
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `
    select * from player_details 
    where player_id=${playerId}`;
  const dbresponse = await db.get(query);

  response.send(playerDetailsFormat(dbresponse));
});

// API 3

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName } = playerDetails;
  const query = `update player_details  
  set 
  player_name="${playerName}"
  where player_id=${playerId}`;
  const dbresponse = await db.all(query);
  response.send("Player Details Updated");
});

// API 4

app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const query = `
    select * 
    from 
       match_details 
    where 
       match_id=${matchId} ;`;
  const dbresponse = await db.get(query);
  response.send(dbresponse);
});

// API 5  https://github.com/Jvjjggj/playerMatchDetails.git
app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const query = `
    select * from 
    `;
});
module.exports = app;
