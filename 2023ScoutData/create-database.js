// Node.js + Express server backend
// v2 - use SQLite (https://www.sqlite.org/index.html) as a database
//
// COGS121 by Philip Guo
// https://github.com/pgbovine/COGS121

// run this once to create the initial database as the scouting.db
//   node create_database.js

// to clear the database, simply delete the scouting.db file:
//   rm scouting.db

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("scouting.db");

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE team (num INTEGER, name TEXT)");

  db.run('INSERT into team (num,name) VALUES (95,"Grasshoppers")');
  db.run('INSERT into team (num,name) VALUES (131,"CHAOS")');
  db.run('INSERT into team (num,name) VALUES (138,"Entropy")');
  db.run('INSERT into team (num,name) VALUES (151,"Tough Techs")');
  db.run('INSERT into team (num,name) VALUES (238,"Crusaders")');
  db.run('INSERT into team (num,name) VALUES (467,"Colonials")');
  db.run('INSERT into team (num,name) VALUES (501,"Team 501 - The PowerKnights Robotics Team")');
  db.run('INSERT into team (num,name) VALUES (663,"Robonauts")');
  db.run('INSERT into team (num,name) VALUES (811,"Wild Cards")');
  db.run('INSERT into team (num,name) VALUES (1058,"PVC Pirates")');
  db.run('INSERT into team (num,name) VALUES (1073,"The Force Team")');
  db.run('INSERT into team (num,name) VALUES (1247,"Blood, Sweat, and Gears")');
  db.run('INSERT into team (num,name) VALUES (1277,"The Robotomies")');
  db.run('INSERT into team (num,name) VALUES (1307,"Robosaints")');
  db.run('INSERT into team (num,name) VALUES (1512,"The Big Red")');
  db.run('INSERT into team (num,name) VALUES (1831,"Screaming Eagles")');
  db.run('INSERT into team (num,name) VALUES (1922,"Oz-Ram")');
  db.run('INSERT into team (num,name) VALUES (2876,"Devilbotz")');
  db.run('INSERT into team (num,name) VALUES (3451,"The ANAMOLY")');
  db.run('INSERT into team (num,name) VALUES (3467,"Windham Windup")');
  db.run('INSERT into team (num,name) VALUES (3566,"Gone Fishin")');
  db.run('INSERT into team (num,name) VALUES (3597,"Robo-Rangers")');
  db.run('INSERT into team (num,name) VALUES (4041,"Iron Tigers")');
  db.run('INSERT into team (num,name) VALUES (4564,"Orange Chaos")');
  db.run('INSERT into team (num,name) VALUES (4761,"Robockets")');
  db.run('INSERT into team (num,name) VALUES (4925,"The Resistance")');
  db.run('INSERT into team (num,name) VALUES (5491,"Hard Reset")');
  db.run('INSERT into team (num,name) VALUES (5687,"The Outliers")');
  db.run('INSERT into team (num,name) VALUES (5902,"The Wire Clippers")');
  db.run('INSERT into team (num,name) VALUES (6161,"Equilibrium")');
  db.run('INSERT into team (num,name) VALUES (6690,"MV roboPride")');
  db.run('INSERT into team (num,name) VALUES (6762,"Oscats")');
  db.run('INSERT into team (num,name) VALUES (6763,"FUSION")');
  db.run('INSERT into team (num,name) VALUES (6933,"Archytas")');
  db.run('INSERT into team (num,name) VALUES (7314,"Tornados")');
  db.run('INSERT into team (num,name) VALUES (7913,"Bearly Functioning")');
  db.run('INSERT into team (num,name) VALUES (8023,"LRTC Androscoggin Argonauts")');
  db.run('INSERT into team (num,name) VALUES (8708,"Ov3r1y K0mp13x")');
  db.run('INSERT into team (num,name) VALUES (8724,"Mayhem")');
  db.run('INSERT into team (num,name) VALUES (9056,"Kents Hill Huskies 9056")');
  
  

  console.log("successfully created the team table in scouting.db");

  // print them out to confirm their contents:
  db.each("SELECT * FROM team", (err, row) => {
    if (err) {
      console.error(err);
    } else {
      console.log(row.num + ": " + row.name);
    }
  });

  // db.run("CREATE TABLE user (name TEXT)");
  // console.log("successfully created the user table in scouting.db");

  // db.run("INSERT INTO user VALUES ('Danny')");
  // db.run("INSERT INTO user VALUES ('Maple')");
  // db.run("INSERT INTO user VALUES ('Karen')");
  // db.run("INSERT INTO user VALUES ('Andy')");

  // // print them out to confirm their contents:
  // db.each("SELECT * FROM user", (err, row) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(row.name);
  //   }
  // });

  // create a new database table:
  db.run("CREATE TABLE pit_report (num INTEGER, weight INTEGER, charge INTEGER, piece_ability INTEGER, height INTEGER, drive_train INTEGER, auto_paths TEXT, drive_hours INTEGER, notes TEXT, created_time TEXT, scout TEXT)");
  console.log("successfully created the pit_report table in scouting.db");

  // CREATE TABLE match_report (match_num INTEGER, team_num INTEGER, created_time INTEGER, created_by TEXT,
  // starting_position INTEGER, high_hole INTEGER, high_port INTEGER, low_hole INTEGER, trench INTEGER,
  // control_panel INTEGER, endgame INTEGER, notes TEXT)
  // print them out to confirm their contents:
  db.each("SELECT * FROM pit_report", (err, row) => {
    if (err) {
      console.error(err);
    } else {
      console.log(row.num + " (" + row.weight + "lbs): " + row.notes);
    }
  });
  /*
  CREATE TABLE match_report (match_num, team_num, starting_position, inner_auto, high_auto, low_auto, inner, high, low, aggression, control_panel, end_position, trench, notes, created_time, created_by)
*/
  // create a new database table:
  db.run("CREATE TABLE match_report (created_time INTEGER, scout TEXT, match_num INTEGER, team_num INTEGER, auto_grid TEXT, auto_charge INTEGER, grid TEXT, charge INTEGER, drops INTEGER, aggression INTEGER, notes TEXT)");
  console.log("successfully created the match_report table in scouting.db");


  // print them out to confirm their contents:
  db.each("SELECT * FROM match_report", (err, row) => {
    if (err) {
      console.error(err);
    } else {
      console.log(row.num + " (" + row.weight + "lbs): " + row.notes);
    }
  });
});

db.close();
