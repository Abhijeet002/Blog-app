import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const db = new pg.Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5433,       // ← reads DB_PORT
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


console.log("→ Connecting to Postgres with:");
console.log("   host:", process.env.DB_HOST);
console.log("   port:", process.env.DB_PORT);
console.log("   user:", process.env.DB_USER);
console.log("   database:", process.env.DB_NAME);
console.log("   password length:", process.env.DB_PASSWORD?.length);



db.connect().then(() => {
    console.log('Connected to the database');
   console.log("DB_HOST =", process.env.DB_HOST);  // should print: localhost
    console.log("Type =", typeof process.env.DB_HOST);   // should print: string
}).catch(err => {
    console.error('Connection error', err.stack);
    
})
db.on('error', err => {
  console.error("Postgres client error:", err);
});
// .finally(() => {
//     db.end();
// });

export { db };
