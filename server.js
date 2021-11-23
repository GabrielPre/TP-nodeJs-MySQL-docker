'use strict';

const express = require('express');
const mysql = require('mysql2/promise');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

const connection = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root",
    database: 'nodejs_mysql_tp_note',
});

let dbIsInit = false
async function initDb(db) {
    if (dbIsInit) {
        return
    }

    await db.execute(`
        DROP TABLE IF EXISTS counter
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS counter (
            name varchar(50) PRIMARY KEY,
            value int
        )`
    );

    dbIsInit = true
}

app.get('/', async (req, res) => {
    const db = await connection
    
    await initDb(db)

    // Increment the counter
    const counterName = 'viewers'

    await db.execute(`
        INSERT INTO counter
            (name, value)
        VALUES
            (?, ?)
        ON DUPLICATE KEY UPDATE
            value = value + 1
        `, 
        [counterName, 1]
    );

    // Retrieve the new value
    const result = await db.execute(`
        SELECT name, value FROM counter WHERE name = ?
    `, [counterName])

    const rows = result[0]
    const myCounter = rows[0].value

    res.send('There is ' + myCounter.toString() +  ' viewers on my site');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
