var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");
var foundCode = false;
var data = [];

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  });

function tick() {
  loadingMessage.innerText = "⌛ Loading video...";
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;
    outputContainer.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    if (code) {
      drawLine(
        code.location.topLeftCorner,
        code.location.topRightCorner,
        "#FF3B58"
      );
      drawLine(
        code.location.topRightCorner,
        code.location.bottomRightCorner,
        "#FF3B58"
      );
      drawLine(
        code.location.bottomRightCorner,
        code.location.bottomLeftCorner,
        "#FF3B58"
      );
      drawLine(
        code.location.bottomLeftCorner,
        code.location.topLeftCorner,
        "#FF3B58"
      );
      if (code.data.length > 0) {
        data = code.data.split(",");
        foundCode = true;
        console.log(foundCode)
        // $("#actionButtons").removeClass("invisible");
        var parsed = "";
        console.log(data[3]);
        if (data[0] === "pit") {
          // scouting_type, teamNum, weight, trench, ball, shooter,
          // notes, created_time, created_by, drive_train, color_wheel, climb, switch
          parsed += "<b><u>Pit Report</u></b> = ";
          parsed += "<b>Collected:</b> " + decodeUnixTimestamp(data[9]) + " ";
          parsed += "<b>Scout:</b> " + data[10] + " ";
          parsed += "<b>Team:</b> " + data[1] + " ";
          parsed += "<b>Weight:</b> " + data[2] + " ";
          parsed += "<b>Balance Ability:</b> " + decodeCharger(data[5]) + " ";
          // decode balance
          // decode peice ability
          // decode height
          parsed += "<b>Piece Ability:</b> " + decodePieceAbility(data[3]) + " ";
          parsed += "<b>Heights:</b> " + decodeHeight(data[4]) + " ";
          parsed += "<b>Drive Train:</b> " + decodeDriveTrain(data[6]) + " ";
          parsed += "<b>Auto Paths:</b> " + data[7] + " ";
          parsed += "<b>Drive Hours:</b> " + data[8] + " ";
          parsed += "<b>Note:</b> " + data[11];
          $("#outputMessage").html(parsed);
          $('#exampleModal').modal('show')
        } else if (data[0] === "match") {
          parsed += "<b><u>Match Report</u></b> = ";
          console.log("got this far")
          parsed += "<b>Collected:</b> " + decodeUnixTimestamp(data[9]) + " ";
          parsed += "<b>Scout:</b> " + data[11] + " ";
          parsed += "<b>Match:</b> " + data[1] + " ";
          parsed += "<b>Team:</b> " + data[2] + " ";
          parsed += "<b>Auto Score:</b>" + decodeAutoGrid(data[3]) + " ";
          //decode grid
          // decode charger
          parsed += "<b>Auto Charge:</b>" + decodeEndPosition(data[4]) + " ";
          parsed += "<b>Grid Score:</b>" + decodeTeleGrid(data[5]) + " ";
          parsed += "<b>Drops:</b>" + (data[7]) + " ";
          parsed += "<b>End Position:</b> " + decodeEndPosition(data[6]) + " ";
          parsed += "<b>Aggression:</b> " + decodeAggression(data[8]) + " ";
          parsed += "<b>Note:</b> " + data[10];
          $("#outputMessage").html(parsed);
          $('#exampleModal').modal('show')
        } else {
          resetScreen();
        }
      }
    } else {
      // outputMessage.hidden = false;
      // outputData.parentElement.hidden = true;
    }
  }
  if (!foundCode) requestAnimationFrame(tick);
}

$("#ignoreButton").click(e => {
  console.log("ignoring");
  e.preventDefault();
  resetScreen();
});

$("#insertButton").click(e => {
  console.log("adding to database");
  e.preventDefault();
  if (data[0] === "pit") {
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: "/pit-report/",
      type: "POST", // <-- this is POST, not GET
      data: {
        num: data[1],
        weight: data[2],
        charge: data[5],
        piece_ability: data[3],
        height: data[4],
        drive_train: data[6],
        auto_paths: decodeNote(data[7]),
        drive_hours: decodeNote(data[8]),
        notes: decodeNote(data[11]),
        created_time: data[9],
        scout: data[10]
      },
      success: data => {
        console.log("data added!");
        $("#outputMessage").html(
          "<b>Success!</b> <i>Looking for another QR Code ...</i>"
        );
      }
    });

    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: "/ranks/",
      type: "POST", // <-- this is POST, not GET
      data: {
        event: "2022necmp1",
        teamNum: data[1],
        rank: 99
      },
      success: data => {
        console.log("team added to event db");
        resetScreen();
      }
    });
    
  } else if (data[0] === "match") {
    console.log(data[11])
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      url: "/match-report/",
      type: "POST", // <-- this is POST, not GET
      data: {
        created_time: data[9],
        scout: data[11],
        match_num: data[1],
        team_num: data[2],
        auto_grid: data[3],
        auto_charge: data[4],
        grid: data[5],
        charge: data[6],
        drops: data[7],
        aggression: data[8],
        notes: data[10]
      },
      success: data => {
        resetScreen();
        $("#outputMessage").html(
          "<b>Success!</b> <i>Looking for another QR Code ...</i>"
        );
      }
    });
  } else {
    resetScreen();
  }
});

function resetScreen() {
  foundCode = false;
  $("#outputMessage").html("<i>Looking for a QR Code...</i>");
  $("#actionButtons").addClass("invisible");
  requestAnimationFrame(tick);
}
