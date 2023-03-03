/* globals $ moment */

$(document).ready(() => {
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
        });
        $("#reportTable").DataTable({
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
  