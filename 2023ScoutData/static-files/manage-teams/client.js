/* globals $ */

$(document).ready(() => {
    loadTeamList();
  
    $("#oneTeamButton").click(() => {
      const requestURL = "/team/" + $("#getNumBox").val();
      console.log("making ajax request to:", requestURL);
  
      // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
      // Using the core $.ajax() method since it's the most flexible.
      // ($.get() and $.getJSON() are nicer convenience functions)
      $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: requestURL,
        type: "GET",
        dataType: "json", // this URL returns data in JSON format
        success: data => {
          console.log("You received some data!", data);
  
          if (data.name) {
            $("#status").html("Successfully fetched team at URL: " + requestURL);
            $("#nameDiv").html("Found team: " + data.name);
          } else {
            $("#status").html("Error: could not find team at URL: " + requestURL);
            // clear the display
            $("#nameDiv").html("");
           // $("#logoImage")
             // .attr("src", "")
              //.attr("width", "0px");
          }
        }
      });
    });
  
    $("#insertButton").click(() => {
      $("#status").html("");
      $.ajax({
        // all URLs are relative to http://localhost:3000/
        url: "/team/",
        type: "POST", // <-- this is POST, not GET
        data: {
          num: $("#team-number").val(),
          name: $("#team-name").val(),
          // insta_link: $("#insta-link").val()
        },
        success: data => {
          $("#status").html("TEAM ADDED");
          $("#team-number").val("");
          $("#team-name").val("");
          // $("#insta-link").val("");
          loadTeamList();
        }
      });
    });
  
    // define a generic Ajax error handler:
    // http://api.jquery.com/ajaxerror/
    $(document).ajaxError(() => {
      $("#status").html("Error: unknown ajaxError!");
    });
  });
  
  function loadTeamList() {
    $("#teamDiv").html("");
      $.ajax({
      url: "/team/",
      type: "GET",
      dataType: "json",
      success: data => {
        console.log("You received some data!", data);
        $.each(data, function(i, team) {
          const YEAR = "2023";
          var teamData =
            "<b>" +
            team.num +
            "</b> " +
            team.name;
          teamData += "<br>";
          $("#teamDiv").append(teamData);
        });
      }
    });
  }
  