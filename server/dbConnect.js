const pg = require ('pg');
const client = new pg.Client(process.env.PG_URL);

client.connect();

module.exports = client;