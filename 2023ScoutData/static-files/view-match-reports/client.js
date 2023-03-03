/* globals $ moment */

var table;
var table2;

$(document).ready(() => {
  $.ajax({
    url: "/match-report/",
    type: "GET",
    dataType: "json",
    success: (data) => {
      console.log("You received some match data!", data);
      var teams = [];
      $.each(data, function (i, item) {
        if (teams.indexOf(item.team_num) < 0) {
          teams.push(item.team_num);
        }
        console.log(item.aggression);
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
        // if (item.notes && item.notes.length > 0) {
        //   newRow +=
        //     "<tr style='border-bottom: 2px solid black'><td colspan=42>Notes: " +
        //     item.notes +
        //     "</td></tr>";
        // }
        $("#indiReportTable tbody").append(newRow);
      });

//       $("#indiReportTable thead th").each(function () {
//         var title = $("#indiReportTable tfoot th").eq($(this).index()).text();
//         $(this).html(
//           "<input type='text' placeholder='Search " +
//             title +
//             "' />"
//         );
//       });

//       $('#example tfoot th').each( function () {
//         var title = $(this).text();
//         $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
//     } );
      
      table = $("#indiReportTable").DataTable({
        paging: false,
      });

//       // Apply the search
//       table
//         .columns()
//         .eq(0)
//         .each(function (colIdx) {
//           $("input", table.column(colIdx).header()).on(
//             "keyup change",
//             function () {
//               table.column(colIdx).search(this.value).draw();
//             }
//           );
//         });

      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

      // populate averages table
      $.each(teams, function (i, team) {
        const filtered = data.filter((t) => t.team_num === team);
        const avgGridAuto =
          Math.round(
            (filtered.reduce(
              (total, next) => total + parseInt(decodeAutoGrid(next.auto_grid)),
              0
            ) /
              filtered.length) *
              100
          ) / 100;
        const avgAutoCharge =
          Math.round(
            (filtered.reduce(
              (total, next) =>
                total + parseInt(autoChargePoints(next.autoCharge)),
              0
            ) /
              filtered.length) *
              100
          ) / 100;
        const avgGrid =
          Math.round(
            (filtered.reduce(
              (total, next) =>
                total + parseInt(decodeTeleGrid(next.grid)),
              0
            ) /
              filtered.length) *
              100
          ) / 100;
        const avgCharge =
          Math.round(
            (filtered.reduce(
              (total, next) =>
                total +
                parseInt(chargePoints(next.charge)
                ),
              0
            ) /
              filtered.length) *
              100
          ) / 100;

        const avgDrops =
          Math.round(
            (filtered.reduce(
              (total, next) =>
                total + parseInt(next.drops),
              0
            ) /
              filtered.length) *
              100
          ) / 100;
        const avgPoints =
          Math.round(
            (filtered.reduce(
              (total, next) =>
                total +
                parseInt(calcScore(next.auto_grid, next.auto_charge, next.grid, next.charge)
                ),
              0
            ) /
              filtered.length) *
              100
          ) / 100;
        const aggressionNum =
          Math.round(
            (filtered.reduce(
              (total, next) => total + parseInt(next.aggression),
              0
            ) /
              filtered.length) *
              100
          ) / 100;

        const avgAggression = decodeAggression(aggressionNum);
        //console.log(avgAutoPos);
        var newRow =
          "<tr style='border-top: 2px solid black'><td>" +
          team +
          "</td><td>" +
          filtered.length +
          // "</td><td>" +
          // "tbd" +
          "</td><td>" +
          avgGridAuto +
          "</td><td>" +
          avgAutoCharge +
          "</td><td>" +
          avgGrid +
          "</td><td>" +
          (isNaN(avgCharge) ? "Unknown" : avgCharge) +
          "</td><td>" +
          avgDrops +
          "</td><td>" +
          avgPoints +
          "</td><td>" +
          avgAggression +
          // "</td><td>" +
          // "tbd" +
          // "</td><td>" +
          // "tbd" +
          // "</td><td>" +
          // "tbd" +
          "</td></tr>";
        $("#avgReportTable tbody").append(newRow);
      });
      table2 = $("#avgReportTable").DataTable({
        paging: false,
      });
    },
  });
});

// define a generic Ajax error handler:
// http://api.jquery.com/ajaxerror/
$(document).ajaxError(() => {
  $("#status").html("Error: unknown ajaxError!");
});

function findMode(numbers) {
  let counted = numbers.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr]++;
    } else {
      acc[curr] = 1;
    }

    return acc;
  }, {});

  let mode = Object.keys(counted).reduce((a, b) =>
    counted[a] > counted[b] ? a : b
  );

  return mode;
}
