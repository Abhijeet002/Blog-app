import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let dbConfig;

if (process.env.NODE_ENV === "production") {
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
}

let db = createNewClient();

function createNewClient() {
  const client = new pg.Client(dbConfig);
  client.on('error', (err) => {
    console.error("❗ Postgres client error:", err);
    reconnect();
  });
  return client;
}

const MAX_RETRIES = 5;
let retries = 0;

async function connectWithRetry() {
  try {
    await db.connect();
    console.log("✅ Connected to the database");
    retries = 0; // reset retries after a successful connection
  } catch (err) {
    console.error("❌ Database connection failed. Retrying...", err);
    retries++;
    if (retries < MAX_RETRIES) {
      const delay = 5000;
      console.log(`⏳ Retry ${retries}/${MAX_RETRIES} in ${delay / 1000} seconds...`);
      setTimeout(connectWithRetry, delay);
    } else {
      console.error("❌ Max retries reached. Could not connect to the database.");
    }
  }
}

function reconnect() {
  console.log("🔄 Recreating and reconnecting Postgres client...");
  db = createNewClient();
  connectWithRetry();
}

connectWithRetry();

export {db};
