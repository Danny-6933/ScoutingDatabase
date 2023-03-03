/* globals $ moment */
let lst = ""

$(document).ready(() => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $.ajax({
    url: "/team/",
    type: "GET",
    dataType: "json",
    success: (data) => {
      console.log("You received some team data!", data);
      $.each(data, function (i, item) {
        // console.log(item)
        var newRow =
          '<br><button class="btn btn-light btn-block text-left" type="button" onclick="showTeamData(' +
          item.num + ')" data-toggle="collapse"' +
          ' data-target="#collapse' +
          item.num +
          '" aria-expanded="false">' +
          "<strong>" +
          item.num +
          "</strong> " +
          item.name +
          '</button><div class="collapse" id="collapse' +
          item.num +
          '" data-parent="#teamList"><div class="card card-body">' +
          '<table id="pitTable' +
          item.num +
          '" class="table table-bordered"><thead class="thead-light"><tr>' +
          "<th>Pit Report</th>" +
          "<th>Weight</th>" +
          "<th>Charge Ability</th>" +
          "<th>Piece Ability</th>" +
          "<th>Height</th>" +
          "<th>Drive Train</th>" +
          "<th>Auto Paths</th>" +
          "<th>Drive Hours</th>" +
          "<th>Notes</th>" +
          "<th>Created:</th>" +
          "<th>Scout</th>" +
          "</tr></thead><tbody></tbody></table>" +
          '<table id="matchTable' +
          item.num +
          '" class="table table-bordered"><thead class="thead-light"><tr>' +
          "<th>Match Report</th>" +
          "<th>Match</th>" +
          "<th>Grid Points(auto)</th>" +
          "<th>Charger Points(auto)</th>" +
          "<th>Grid Points</th>" +
          "<th>Pieces Dropped</th>" +
          "<th>Charger Points</th>" +
          "<th>Aggression</th>" +
          "<th>Score</th>" +
          "<th>Notes</th>" +
          "<th>Created Time</th>" +
          "<th>Scout</th>" +
          "</tr></thead><tbody></tbody></table>"
        $("#teamList").append(newRow);
      });

      $.ajax({
        url: "/new-match-report/",
        type: "GET",
        dataType: "json",
        success: (data) => {
          console.log("You received some match data!", data);
          $.each(data, function (i, item) {
            
            var newRow =
            "<tr style='border-top: 2px solid black'><td>" +
            item.team_num +
            "</td><td>" +
            item.match_num +
            "</td><td>" +
  
            decodeAutoGrid(item.auto_grid) +
            "</td><td>" +
            autoChargePoints(item.auto_charge) +
            "</td><td>" +
            decodeTeleGrid(item.grid) +
            "</td><td>" +
            chargePoints(item.charge) +
            "</td><td>" +
            item.drops +
            "</td><td>" +
            decodeAggression(item.aggression) +
            "</td><td>" +
            calcScore(item.auto_grid, item.auto_charge, item.grid, item.charge) +
            "</td><td>" +
            item.notes +
            "</td><td>" +
            decodeUnixTimestamp(item.created_time) +
            "</td><td>" +
            item.scout +
            "</td></tr>";
            $("#matchTable" + item.team_num + " tbody").append(newRow);
            //console.log(item);
            //$("#drawingData" + item.team_num).append(item.coords);
            //console.log($("#drawingData" + item.team_num).val())
            $("#badge" + item.team_num).html(
              parseInt($("#badge" + item.team_num).html()) + 1
            );
          });
        },
      });

      $.ajax({
        url: "/pit-report/",
        type: "GET",
        dataType: "json",
        success: (data) => {
          console.log("You received some pit data!", data);
          $.each(data, function (i, item) {
            //console.log(item.climb);
            var newRow =
            "<tr><td>" +
            item.num +
            "</td><td>" +
            item.weight +
            "</td><td>" +
            decodeCharger(item.charge) +
            "</td><td>" +
            decodePieceAbility(item.piece_ability) +
            "</td><td>" +
            decodeHeight(item.height) +
            "</td><td>" +
            decodeDriveTrain(item.drive_train) +
            "</td><td>" +
            (item.auto_paths === "undefined" ? "No notes" : item.auto_paths) +
            "</td><td>" +
            (item.drive_hours === "undefined" ? "No notes" : item.drive_hours) +
            "</td><td>" +
            (item.notes === "undefined" ? "No notes" : item.notes) +
            "</td><td>" +
            decodeUnixTimestamp(item.created_time) +
            "</td><td>" +
            item.scout +
            "</td></tr>";
            $("#reportTable tbody").append(newRow);
            $("#pitTable" + item.num + " tbody").append(newRow);
            $("#badge" + item.num).html(
              parseInt($("#badge" + item.num).html()) + 1
            );
          });
        },
      });
    },
  });
});

// define a generic Ajax error handler:
// http://api.jquery.com/ajaxerror/
// $(document).ajaxError(() => {
//   $("#status").html("Error: unknown ajaxError!");
// });
// let coords = "";
// function showTeamData(teamNum) {
//   document.getElementById("drawing" + teamNum).appendChild(document.getElementById("drawing"));
//   field();
//   coords += document.getElementById("drawingData" + teamNum).innerHTML
//   // loadQR(teamNum);
//   drawShots(coords)
//   console.log(coords);
//   coords = "";
// }

// function loadQR(teamId) {
//   if (document.getElementById("qrcode" + teamId).innerHTML.length < 10) {
//     console.log("loading QR for " + teamId);
//     var qrText = "";
//     var matchTableBody = document.getElementById("matchTable" + teamId)
//       .childNodes[1];
//     if (matchTableBody) {
//       qrText += matchTableBody.innerHTML;
//     }
//     console.log(qrText);
//     console.log(qrText.length);
//     var qrcode = new QRCode(document.getElementById("qrcode" + teamId), {
//       text: qrText,
//       width: 512,
//       height: 512,
//       colorDark: "#000000",
//       colorLight: "#ffffff",
//       correctLevel: QRCode.CorrectLevel.L,
//     });
//   }
// }