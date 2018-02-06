var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Amer1can@localhost:5432/todo';

const handleError = (err, done) => {
  done();
  console.log(err);
  return res.status(500).json({success: false, data: err});
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//LIST
router.get('/api/v1/todos', (req, res, next) => {
  const results = [];

  pg.connect(connectionString, (err, client, done) => {
    //handle connections errors
    if (err) {
      return handleError(err, done);
    }

    //SQL QUERY > Select data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    //stream results back one row at a time
    query.on('row', row => {
      results.push(row);
    });

    //After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//GET by ID
router.get('/api/v1/todos/:id', (req, res, next) => {
  const results = [];
  const todoId = req.params.id;

  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      return handleError(err, done);
    }
    //SQL QUERY > Select data
    const query = client.query(`Select * from items where id = ${todoId}`);
    //stream results back one row at a time
    query.on('row', row => {
      results.push(row);
    });

    //After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//CREATE
router.post('/api/v1/todos', (req, res, next) => {
  const results = [];

  //grab data from http req 
  const data = {text: req.body.text, complete: false};

  //Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    //handle connections errors
    if (err) {
      return handleError(err, done);
    }

    //SQL Query > insert data
    client.query('INSERT INTO items(text, complete) values ($1, $2)',
      [data.text, data.complete]);

    //SQL QUERY > Select data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    //stream results back one row at a time
    query.on('row', row => {
      results.push(row);
    });

    //After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
