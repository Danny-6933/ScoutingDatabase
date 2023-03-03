// Node.js + Express server backend
// version 2 - use SQLite (https://www.sqlite.org/index.html) as a database
//
// COGS121 by Philip Guo
// https://github.com/pgbovine/COGS121

const express = require("express");
const app = express();

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("scouting.db");

const bodyParser = require("body-parser");

const nunjucks = require("nunjucks");
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: false // TODO: !! SET TO FALSE WHEN NOT DEVELOPING !!
});
// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static-files/
// sub-directory, and the server will serve them from there.
app.use(express.static("static-files"));
app.use(bodyParser.urlencoded({ extended: true })); // hook up with your app

// GET a list of all teams
app.get("/team/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all("SELECT * FROM team ORDER BY num ASC", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log("sup" + rows);
      res.send(rows);
    }
  });
});

app.post("/user/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO user VALUES ($name);",
    // parameters to SQL query:
    {
      $name: req.body.name
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.post(/user)" });
      } else {
        res.send({
          message: "successfully added <b>" + req.body.name + "</b>"
        });
      }
    }
  );
});


app.post("/note/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO notes VALUES ($user, $note, $timestamp);",
    // parameters to SQL query:
    {
      $user: req.body.user,
      $note: req.body.note,
      $timestamp: req.body.timestamp
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.post(/note)" });
      } else {
        res.send({
          message: "successfully added <b>" + req.body.user + "</b>'s note'"
        });
      }
    }
  );
});


// GET a list of all teams for a match
app.get("/teams-for-match/:event_code/:match_num", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    "SELECT red1, red2, red3, blue1, blue2, blue3 FROM match WHERE event_code = $event_code AND match_num = $match_num",
    {
      $event_code: req.params.event_code,
      $match_num: req.params.match_num
    },
    (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        var teams = []
        teams.push(rows[0].red1);
        teams.push(rows[0].red2);
        teams.push(rows[0].red3);
        teams.push(rows[0].blue1);
        teams.push(rows[0].blue2);
        teams.push(rows[0].blue3);
        console.log(rows);
        res.send(teams);
      }
    }
  );
});

// GET a list of all teams
app.get("/user/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all("SELECT * FROM user", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});

// GET a list of all notes
app.get("/note/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all("SELECT * FROM notes", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});


// GET a list of all pit reports
app.get("/pit-report/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all("SELECT * FROM pit_report WHERE created_time > 1650081210000 ORDER BY created_time DESC", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});

// POST data about a pit report
app.post("/pit-report/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO pit_report (num, weight, charge, piece_ability, height, drive_train, auto_paths, drive_hours, notes, created_time, scout)" +
      "VALUES ($num, $weight, $charge, $piece_ability, $height, $drive_train, $auto_paths, $drive_hours, $notes, $created_time, $scout)",
    // parameters to SQL query:
    {
      $num: req.body.num,
      $weight: req.body.weight,
      $charge: req.body.charge,
      $piece_ability: req.body.piece_ability,
      $height: req.body.height,
      $drive_train: req.body.drive_train,
      $auto_paths: req.body.auto_paths,
      $drive_hours: req.body.drive_hours,
      $notes: req.body.notes,
      $created_time: req.body.created_time,
      $scout: req.body.scout
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.post(/pit-report/)" });
      } else {
        res.send({ message: "successfully run app.post(/pit-report/)" });
      }
    }
  );
});

app.post("/ranks/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO ranks (event, teamNum, rank)" +
      "VALUES ($event, $teamNum, $rank)",
    // parameters to SQL query:
    {
      $event: req.body.event,
      $teamNum: req.body.teamNum,
      $rank: req.body.rank
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.post(/ranks/)" });
      } else {
        res.send({ message: "successfully run app.post(/ranks/)" });
      }
    }
  );
});

app.post("/ranks-update/", (req, res) => {
  console.log(req.body);
  db.run(
    "UPDATE ranks SET rank = $rank WHERE teamNum = $teamNum AND event = $event",
    // parameters to SQL query:
    {
      $event: req.body.event,
      $teamNum: req.body.teamNum,
      $rank: req.body.rank
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.update(/ranks/)" });
      } else {
        res.send({ message: "db update: " + req.body.teamNum + " given new rank " + req.body.rank });
      }
    }
  );
});

// GET a list of all ranks
app.get("/ranks/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all("SELECT * FROM ranks ORDER BY rank ASC", {
      $event: req.body.event
    },
  (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});

app.post("/ranks2/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO ranks2 (event, teamNum, rank)" +
      "VALUES ($event, $teamNum, $rank)",
    // parameters to SQL query:
    {
      $event: req.body.event,
      $teamNum: req.body.teamNum,
      $rank: req.body.rank
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.post(/ranks/)" });
      } else {
        res.send({ message: "successfully run app.post(/ranks/)" });
      }
    }
  );
});

app.post("/ranks-update2/", (req, res) => {
  console.log(req.body);
  db.run(
    "UPDATE ranks2 SET rank = $rank WHERE teamNum = $teamNum AND event = $event",
    // parameters to SQL query:
    {
      $event: req.body.event,
      $teamNum: req.body.teamNum,
      $rank: req.body.rank
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        res.send({ message: "error in app.update(/ranks/)" });
      } else {
        res.send({ message: "db update: " + req.body.teamNum + " given new rank " + req.body.rank });
      }
    }
  );
});

// GET a list of all ranks
app.get("/ranks2/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all("SELECT * FROM ranks2 ORDER BY rank ASC", {
      $event: req.body.event
    },
  (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});

// GET a list of all match reports
app.get("/match-report/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    "SELECT * FROM match_report ORDER BY created_time DESC",
    (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        console.log(rows);
        res.send(rows);
      }
    }
  );
});
// GET a list of all recent match reports
app.get("/new-match-report/", (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    "SELECT * FROM match_report ORDER BY created_time DESC",
    (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        console.log(rows);
        res.send(rows);
      }
    }
  );
});

// GET a list of match reposrts for given teams
app.get("/quick-view/", (req, res) => {
  db.all(
    "SELECT * FROM match_report",
    (err, rows) => {
      console.log("sick");
      if (err) {
        console.error(err);
      } else {
        console.log(rows);
        res.send(rows);
      }
    }
  );
});

// GET a list of all matches
// app.get("/match/:event_code", (req, res) => {
//   // db.all() fetches all results from an SQL query into the 'rows' variable:
//   db.all(
//     "SELECT * FROM match WHERE event_code = $event_code ORDER BY match_num ASC",
//     {
//       $event_code: req.params.event_code
//     },
//     (err, rows) => {
//       if (err) {
//         console.error(err);
//       } else {
//         console.log(rows);
//         res.send(rows);
//       }
//     }
//   );
// });

// POST data about a match
// app.post("/match/", (req, res) => {
//   console.log(req.body);
//   db.run(
//     "INSERT INTO match " +
//       "(event_code, match_num, match_type, red1, red2, red3, blue1, blue2, blue3)" +
//       "VALUES " +
//       "($event_code, $match_num, $match_type, $red1, $red2, $red3, $blue1, $blue2, $blue3)",
//     // parameters to SQL query:
//     {
//       $event_code: req.body.event_code,
//       $match_num: req.body.match_num,
//       $match_type: req.body.match_type,
//       $red1: req.body.red1,
//       $red2: req.body.red2,
//       $red3: req.body.red3,
//       $blue1: req.body.blue1,
//       $blue2: req.body.blue2,
//       $blue3: req.body.blue3
//     },
//     // callback function to run when the query finishes:
//     err => {
//       if (err) {
//         res.send({ message: "error in app.post(/match/)" });
//       } else {
//         res.send({ message: "success" });
//       }
//     }
//   );
// });

// POST data about a match
// app.post("/match-update/", (req, res) => {
//   console.log(req.body);
//   db.run(
//     "UPDATE match " +
//       "SET match_type = $match_type, red1=$red1, red2=$red2, red3=$red3, blue1=$blue1, blue2=$blue2, blue3=$blue3 " +
//       "WHERE event_code = $event_code AND match_num = $match_num",
//     {
//       $event_code: req.body.event_code,
//       $match_num: req.body.match_num,
//       $match_type: req.body.match_type,
//       $red1: req.body.red1,
//       $red2: req.body.red2,
//       $red3: req.body.red3,
//       $blue1: req.body.blue1,
//       $blue2: req.body.blue2,
//       $blue3: req.body.blue3
//     },
//     // callback function to run when the query finishes:
//     err => {
//       if (err) {
//         res.send({ message: "error in app.post(/match-update/)" });
//       } else {
//         res.send({ message: "success" });
//       }
//     }
//   );
// });

// POST data about a match report
app.post("/match-report/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO match_report " +
      "(created_time, scout, match_num, team_num, auto_grid, auto_charge, grid, charge, drops, aggression, notes )" +
      "VALUES " +
      "($created_time, $scout, $match_num, $team_num, $auto_grid, $auto_charge, $grid, $charge, $drops, $aggression, $notes)",
    // parameters to SQL query:


    {
      $created_time: req.body.created_time,
      $scout: req.body.scout,
      $match_num: req.body.match_num,
      $team_num: req.body.team_num,
      $auto_grid: req.body.auto_grid,
      $auto_charge: req.body.auto_charge,
      $grid: req.body.grid,
      $charge: req.body.charge,
      $drops: req.body.drops,
      $aggression: req.body.aggression,
      $notes: req.body.notes
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        console.log(err );
        res.send({ message: "error in app.post(/match-report/)" });
      } else {
        res.send({ message: "successfully run app.post(/match-report/)" });
      }
    }
  );
});

// POST data about a team to insert into the database
app.post("/team/", (req, res) => {
  console.log(req.body);
  db.run(
    "INSERT INTO team VALUES ($num, $name);",
    // parameters to SQL query:
    {
      $num: req.body.num,
      $name: req.body.name
      // $insta_link: req.body.insta_link
    },
    // callback function to run when the query finishes:
    err => {
      if (err) {
        console.log(err);
        res.send({ message: "error in app.post(/team)" });
      } else {
        res.send({
          message:
            "successfully added <b>" +
            req.body.num +
            ": " +
            req.body.name +
            "</b>"
        });
      }
    }
  );
});

// GET profile data for a team
app.get("/team/:num", (req, res) => {
  const numToLookup = req.params.num; // matches ':num' above

  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    "SELECT * FROM team WHERE num=$num",
    // parameters to SQL query:
    {
      $num: numToLookup
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        if (rows.length > 0) {
          var team = rows[0];
          console.log(team)
          console.log("ready to render team page!")
          // nunjucks.renderString('Hello {{ username }}', { username: 'James' });
          res.render("team.html", {
            num: team.num,
            name: team.name
          });
          // res.send({
          //   num: team.num,
          //   name: team.name
          // });
        } else {
          res.send({}); // no teams, so return an empty object instead of undefined
        }
      }
    }
  );
});

// app.get("/event/", (req, res) => {
//   db.all("SELECT * FROM event", (err, rows) => {
//     if (err) {
//       res.send({ message: "error in app.get(/event/)" });
//     } else {
//       res.send(rows);
//     }
//   });
// });

// app.post("/event_team_add/", (req, res) => {
//   console.log(req.body);
//   db.run(
//     "INSERT INTO event_team VALUES ($event_code, $team_num);",
//     // parameters to SQL query:
//     {
//       $event_code: req.body.event_code,
//       $team_num: req.body.team_num
//     },
//     // callback function to run when the query finishes:
//     err => {
//       if (err) {
//         res.send({ message: "error in app.post(/event_team_add/)" });
//       } else {
//         res.send({
//           message: "success"
//         });
//       }
//     }
//   );
// });

// app.post("/event_team_delete/", (req, res) => {
//   console.log(req.body);
//   db.run(
//     "DELETE FROM event_team WHERE event_code = $event_code AND team_num = $team_num;",
//     // parameters to SQL query:
//     {
//       $event_code: req.body.event_code,
//       $team_num: req.body.team_num
//     },
//     // callback function to run when the query finishes:
//     err => {
//       if (err) {
//         res.send({ message: "error in app.post(/event_team_delete/)" });
//       } else {
//         res.send({
//           message: "success"
//         });
//       }
//     }
//   );
// });

// app.get("/event_team/:event_code", (req, res) => {
//   db.all(
//     "SELECT team.num as team_num, team.name as team_name, event_code FROM team LEFT JOIN " +
//       "(SELECT * FROM event_team WHERE event_code = $event_code) " +
//       "ON team_num = team.num;",
//     {
//       $event_code: req.params.event_code
//     },
//     (err, rows) => {
//       if (err) {
//         res.send({ message: "error in app.get(/event_team/)" });
//       } else {
//         res.send(rows);
//       }
//     }
//   );
// });

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log("Server started at http://localhost:3000/");
});
// app.listen(3000,'192.168.1.7' || 'localhost',function() {
//     console.log('Application worker ' + process.pid + ' started...');
//   }
//   );
// app.listen(3000, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1');
