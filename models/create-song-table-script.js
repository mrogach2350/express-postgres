const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Amer1can@localhost:5432/todo';

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
    'CREATE TABLE songs(id SERIAL PRIMARY KEY, track VARCHAR(50) not null, artist VARCHAR(50) not null, album VARCHAR(50))'
);
query.on('end', () => {
    client.end();
});