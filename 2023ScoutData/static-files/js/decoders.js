//TODO:
// decode grid

function decodeUnixTimestamp(t) {
    // return moment(t).format("D MMM YY, h:mm a");
    t = parseInt(t);
    return moment(t).fromNow();
  }
  
  function decodePieceAbility(n) {
    n = parseInt(n);
    let output = "";
    switch (n) {
      case 0:
        output = "None";
        break;
      case 1:
        output = "Cubes";
        break;
      case 2:
        output = "Cones";
        break;
      case 3:
        output = "Both";
        break;
    }
    return output;
  }
  
  function decodeAggression(n) {
    n = parseInt(n);
    let output = "";
    switch (n) {
      case 0:
        output = "No defense played";
        break;
      case 1:
        output = "Unsuccessful defense";
        break;
      case 2:
        output = "Somewhat successful defense";
        break;
      case 3:
        output = "Not great to OK defense";
        break;
      case 4:
        output = "Successful defense";
        break;
      case 6:
        output = "Not bad defense";
        break;
      case 8:
        output = "Very successful defense";
        break;
      case 12:
        output = "Pretty successful defense";
        break;
      case 16:
        output = "Extreme defense(carded)";
        break;
      case 20:
        output = "Successful but carded";
        break;
      case 24:
        output = "Successful but carded";
        break;
      default:
        output = "No defense";
        break;
    }
    return output;
  }
  
  function decodeStartingPosition(n) {
    n = parseInt(n);
    let output = "";
    switch (n) {
      case 1:
        output = "Driver Left";
        break;
      case 2:
        output = "Driver Center";
        break;
      case 4:
        output = "Driver Auto";
        break;
      case 8:
        output = "Opponent Left";
        break;
      case 16:
        output = "Opponent Center";
        break;
      case 32:
        output = "Opponent Right";
        break;
    }
    return output;
  }
  
  function decodeEndPosition(n) {
    n = parseInt(n);
    let output = "Failed Calculation";
    switch (n) {
      case 0:
        output = "No Charge";
        break;
      case 1:
        output = "Unbalanced Charge";
        break;
      case 2:
        output = "Balanced Charge";
        break;
    }
    return output;
  }
  
  function decodeHeight(n) {
    n = parseInt(n);
    let output = "";
    switch (n) {
      case 0:
        output = "Unknown";
        break;
      case 1:
        output = "Floor";
        break;
      case 2:
        output = "Middle";
        break;
      case 3:
        output = "Middle and Floor"
        break;
      case 4:
        output = "Top";
        break;
      case 5:
        output = "Top and Floor";
        break;
      case 6:
        output = "Top and Middle";
        break;
      case 7:
        output = "All levels";
        break;
    }
    return output;
  }
  
  function decodeDriveTrain(n) {
    n = parseInt(n);
    let output = "";
    switch (n) {
      case 0:
        output = "Unknown";
        break;
      case 1:
        output = "Regular(Tank)";
        break;
      case 2:
        output = "Mecanum";
        break;
      case 4:
        output = "Omni Assist";
        break;
      case 8:
        output = "Swerve";
        break;
    }
    return output;
  }
  
  function decodeCharger(n) {
    n = parseInt(n);
    let output = "";
    switch (n) {
      case 0:
        output = "Unknown";
        break;
      case 1:
        output = "Cannot Balance";
        break;
      case 2:
        output = "Manual balance";
        break;
      case 4:
        output = "Auto balance";
        break;
    }
    return output;
  }
  
  function decodeTime(duration) {
    const longDate = new Date(duration);
    const name = longDate.toString();
    const dates = name.substring(0, 10);
    return name;
  }

  
  function decodeNote(n) {
    for (let i = 0; i < n.length - 1; i++) {
      if (n.substring(i, i + 1) == "," || n.substring(i, i + 1) == "\"") {
        n = n.substring(0, i) + "-" + n.substring(i + 1, n.length);
      }
    }
    return n;
  }

  function decodeTeleGrid(s) {
      let ground = s.substring(0,9)
      let mid = s.substring(9,18)
      let top = s.substring(18)
      // console.log(ground)
      // console.log(mid)
      // console.log(top)
      let score = 0
  
      for (let i = 0; i < 9; i ++) {
        if (ground.substring(i, i+1) != "0") {score += 2}
        if (mid.substring(i, i+1) != "0") {score += 3}
        if (top.substring(i, i+1) != "0") {score += 5}
      }
    return score
  }

  function decodeAutoGrid(s) {
      let ground = s.substring(0,9)
      let mid = s.substring(9,18)
      let top = s.substring(18)
      // console.log(ground)
      // console.log(mid)
      // console.log(top)
      let score = 0
  
      for (let i = 0; i < 9; i ++) {
        if (ground.substring(i, i+1) != "0") {score += 3}
        if (mid.substring(i, i+1) != "0") {score += 4}
        if (top.substring(i, i+1) != "0") {score += 6}
      }
    return score
  }
//auto balance = 12
// auto charge = 8?

  function calcScore(ag, ac, g, c) {
    let score = 0
    let o
    score += decodeAutoGrid(ag)
    score += decodeTeleGrid(g)
    ac == 1 ? score += 8 : ac == 2 ? score += 12 : score += 0
    c == 1 ? score += 6 : c == 2 ? score += 10 : score += 0
    return score
  }

  function chargePoints(c) {
    let score = 0
    c == 1 ? score = 6 : c == 2 ? score = 10 : score = 0
    return score
  }

  function autoChargePoints(c) {
    let score = 0
    c == 1 ? score = 8 : c == 2 ? score = 12 : score = 0
    return score
  }
  