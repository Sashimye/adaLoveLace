const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = require("sqlite");

async function getDB() {
  const db = await open({
    filename: path.join(__dirname, "adalovelace.db"),
    driver: sqlite3.Database,
  });
  return db;
}

async function initDB() {
  const db = await getDB();

  await db.exec(`
        CREATE TABLE IF NOT EXISTS users(
        id          TEXT NOT NULL PRIMARY KEY,
        nom         TEXT NOT NULL 
        )
    `);

  await db.exec(`
      INSERT INTO users VALUES
      ('1','Justin')
`);
  console.log("Database ready");
}

initDB();
module.exports = { getDB, initDB };
