const express = require("express");
const app = express();

app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dbPath = path.join(__dirname, "covid19India.db");

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is Running At http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error Message:${e.message}`);
  }
};
initializeDbAndServer();

//7 GET Total Statistics of states
app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const getTotalStatistics = `
        SELECT 
        SUM(cases) AS totalCases,
        SUM(cured) AS totalCured,
        SUM(active) AS totalActive,
        SUM(deaths) AS totalDeaths
        FROM 
        district
        WHERE 
        state_id = ${stateId};
    `;
  const stats = await database.get(getTotalStatistics);
  console.log(stats);
});
