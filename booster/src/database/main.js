const sqlite3 = require('sqlite3').verbose();

// Function to create SQLite database
const createSQLiteDatabase = () => {
    return new sqlite3.Database("./main.sqlite");
}

const db = createSQLiteDatabase()


// Function to create tables
const createTable = (tableName) => {
    // Define your table creation queries here
    const createTableQuery1 = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    value TEXT 
  )`;

    // Execute table creation queries
    db.serialize(() => {
        db.run(createTableQuery1, (err) => {
            if (err) {
                console.error(`Error creating table ${tableName}: ` + err.message);
            } else {
                console.log(`Table ${tableName} was created successfully`);
            }
        })
    })
}

const populateTable = (tableName, records) => {
    // Check if the table is empty
    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, result) => {
        if (err) {
            console.error(`Error checking if table ${tableName} is empty: ` + err.message);
            return;
        }

        // If the table is empty, populate it with records
        if (result.count === 0) {
            console.log(`Table ${tableName} is empty. Populating with records...`);
            const insertQuery = `INSERT INTO ${tableName} (${Object.keys(records[0]).join(', ')}) VALUES (${Object.keys(records[0]).map(() => '?').join(', ')})`;

            db.serialize(() => {
                const stmt = db.prepare(insertQuery);
                records.forEach(record => {
                    stmt.run(Object.values(record));
                });
                stmt.finalize();
                console.log(`Records inserted into ${tableName}`);
            });
        } else {
            console.log(`Table ${tableName} is not empty. Skipping population.`);
        }
    });
}

async function updateRecords(tableName, columnName, data) {
    // Assuming 'data' is an array of objects containing 'id' and 'newValue' fields
    data.forEach(({ id, name, newValue }) => {
        const updateQuery = `UPDATE ${tableName} SET ${columnName} = ? WHERE ${id ? 'id = ?' : 'name = ?'}`;

        console.log(updateQuery, name, newValue)

        db.run(updateQuery, [newValue, id ? id : name], (err) => {
            if (err) {
                throw 'Error updating record: ' + err.message
            } else {
                console.log('Record updated successfully');
            }
        });
    });
}

function getAllRecords(tableName) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tableName}`;
        
        db.all(query, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}

function getRecordByName(tableName, name) {
    const query = `SELECT * FROM ${tableName} WHERE name = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [name], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        })
    });
}

module.exports = {
    createSQLiteDatabase,
    createTable,
    populateTable,
    updateRecords,

    getRecordByName,
    getAllRecords,
    db
};