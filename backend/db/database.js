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
        pseudo         TEXT NOT NULL,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS projects(
    id          TEXT NOT NULL PRIMARY KEY,
    nom         TEXT NOT NULL,
    description TEXT,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS tasks(
  id          TEXT NOT NULL PRIMARY KEY,
  nom         TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'todo',
  project_id  TEXT NOT NULL,
  due_date    DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
)
  `);
  console.log("Database ready");
}


module.exports = { getDB, initDB };
