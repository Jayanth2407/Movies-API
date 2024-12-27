const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const dbPath = path.join(__dirname, "moviesData.db");
const db = new sqlite3.Database(dbPath);

// API 1: Get all movie names
app.get("/movies/", (req, res) => {
  const query = "SELECT movie_name AS movieName FROM movie";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send(rows);
    }
  });
});

// API 2: Add a new movie
app.post("/movies/", (req, res) => {
  const { directorId, movieName, leadActor } = req.body;
  const query = `
    INSERT INTO movie (director_id, movie_name, lead_actor)
    VALUES (?, ?, ?)
  `;
  db.run(query, [directorId, movieName, leadActor], function (err) {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send("Movie Successfully Added");
    }
  });
});

// API 3: Get a movie by ID
app.get("/movies/:movieId/", (req, res) => {
  const { movieId } = req.params;
  const query = `
    SELECT 
      movie_id AS movieId, 
      director_id AS directorId, 
      movie_name AS movieName, 
      lead_actor AS leadActor 
    FROM movie 
    WHERE movie_id = ?
  `;
  db.get(query, [movieId], (err, row) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else if (!row) {
      res.status(404).send("Movie Not Found");
    } else {
      res.send(row);
    }
  });
});

// API 4: Update movie details by ID
app.put("/movies/:movieId/", (req, res) => {
  const { movieId } = req.params;
  const { directorId, movieName, leadActor } = req.body;
  const query = `
    UPDATE movie 
    SET director_id = ?, movie_name = ?, lead_actor = ?
    WHERE movie_id = ?
  `;
  db.run(query, [directorId, movieName, leadActor, movieId], function (err) {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send("Movie Details Updated");
    }
  });
});

// API 5: Delete a movie by ID
app.delete("/movies/:movieId/", (req, res) => {
  const { movieId } = req.params;
  const query = `DELETE FROM movie WHERE movie_id = ?`;
  db.run(query, [movieId], function (err) {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send("Movie Removed");
    }
  });
});

// API 6: Get all directors
app.get("/directors/", (req, res) => {
  const query = `
    SELECT director_id AS directorId, director_name AS directorName FROM director
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send(rows);
    }
  });
});

// API 7: Get movies by a specific director
app.get("/directors/:directorId/movies/", (req, res) => {
  const { directorId } = req.params;
  const query = `
    SELECT movie_name AS movieName 
    FROM movie 
    WHERE director_id = ?
  `;
  db.all(query, [directorId], (err, rows) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send(rows);
    }
  });
});

module.exports = app;
