// import pg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// const db = new pg.Client({
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10) || 5433,       // ← reads DB_PORT
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });


// console.log("→ Connecting to Postgres with:");
// console.log("   host:", process.env.DB_HOST);
// console.log("   port:", process.env.DB_PORT);
// console.log("   user:", process.env.DB_USER);
// console.log("   database:", process.env.DB_NAME);
// console.log("   password length:", process.env.DB_PASSWORD?.length);



// db.connect().then(() => {
//     console.log('Connected to the database');
//    console.log("DB_HOST =", process.env.DB_HOST);  // should print: localhost
//     console.log("Type =", typeof process.env.DB_HOST);   // should print: string
// }).catch(err => {
//     console.error('Connection error', err.stack);
    
// })
// db.on('error', err => {
//   console.error("Postgres client error:", err);
// });


// export { db };


// import pg from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// let db;

// if (process.env.DATABASE_URL) {
//   // Production (Railway)
//   db = new pg.Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });

//   console.log("→ Connecting to Railway Postgres via DATABASE_URL");
// } else {
//   // Local development
//   db = new pg.Client({
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT, 10) || 5433,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });

//   console.log("→ Connecting to Local Postgres with:");
//   console.log("   host:", process.env.DB_HOST);
//   console.log("   port:", process.env.DB_PORT);
//   console.log("   user:", process.env.DB_USER);
//   console.log("   database:", process.env.DB_NAME);
//   console.log("   password length:", process.env.DB_PASSWORD?.length);
// }

// const MAX_RETRIES = 5;
// let retries = 0;

// async function connectWithRetry() {
//   try {
//     await db.connect();
//     console.log("Connected to the database");
//   } catch (err) {
//     console.error("Database connection failed. Retrying...", err);
//     retries++;
//     if (retries < MAX_RETRIES) {
//       const delay = 5000; // retry after 5 seconds
//       console.log(`Retry ${retries}/${MAX_RETRIES} in ${delay / 1000} seconds...`);
//       setTimeout(connectWithRetry, delay);
//     } else {
//       console.error("Max retries reached. Could not connect to the database.");
//     }
//   }
// }

// connectWithRetry();

// db.on('error', err => {
//   console.error("Postgres client error:", err);
// });

// export { db };




import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let db;

if (process.env.NODE_ENV === "production") {
  db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new pg.Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

const MAX_RETRIES = 5;
let retries = 0;

async function connectWithRetry() {
  try {
    await db.connect();
    console.log("✅ Connected to the database");
  } catch (err) {
    console.error("❌ Database connection failed. Retrying...", err);
    retries++;
    if (retries < MAX_RETRIES) {
      const delay = 5000; // 5 seconds delay
      console.log(`⏳ Retry ${retries}/${MAX_RETRIES} in ${delay / 1000} seconds...`);
      setTimeout(connectWithRetry, delay);
    } else {
      console.error("❌ Max retries reached. Could not connect to the database.");
    }
  }
}

// initial connection attempt
connectWithRetry();

// reconnect on unexpected client errors
db.on('error', err => {
  console.error("❗ Postgres client error:", err);
  console.log("🔄 Attempting to reconnect to the database...");
  connectWithRetry();
});

export default db;
