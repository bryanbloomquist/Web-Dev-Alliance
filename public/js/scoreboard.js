$(document).ready(function () {
  let rank = 0;

  const user = localStorage.getItem("username");

  // Get the RANK, NAME, and SCORE elements by their ID
  const $sbRankDiv = $("#scoreboard-rank");
  const $sbNameDiv = $("#scoreboard-name");
  const $sbScoreDiv = $("#scoreboard-score");

  const divContainer = x => {
    return `<div style="width:100%;height:0;padding-bottom:${x}%;position:relative;">`;
  };


  function saveScoreFinal() {
    //get user's current highscore for comparison
    $.ajax({
      method: "GET",
      url: "/api/users/" + user
    }).then(function (result) {
      const score = result.currentScore;
      const stress = result.currentStress;
      const highestScore = result.highScore;
      const highestStress = result.highStress;
      //change modal text/image based on if the user passed, failed, or stressed out
      if (score <= 0 && score !== -1) {
        $('#questionModal').modal('show');
        $(".questionMsg").html("You have flunked out of class.")
        $("#questionFlavor").html(`
          ${divContainer(56)}<img src="images/giphy/final-willy-wonka.gif" class="gif" alt="willy wonka yelling"></div>
        `)
      } else if (stress >= 50 && score !== -1) {
        $('#questionModal').modal('show');
        $(".questionMsg").html("You cracked under the pressure!")
        $("#questionFlavor").html(`
          ${divContainer(56)}<img src="images/giphy/final-homer-crazy.gif" class="gif" alt="homer go something something gif"></div>
        `)
      } else if (score !== -1) {
        $('#questionModal').modal('show');
        $(".questionMsg").html("You did it! You have graduated from the bootcamp!")
        $("#questionFlavor").html(`
          ${divContainer(114)}<img src="images/giphy/final-rock-graduate.gif" class="gif" alt="the rock graduates gif"></div>
        `)
      } else {
        $('#questionModal').modal('show');
        $(".questionMsg").html("You have shuffled off this mortal coil. I hope that trip was worth it.")
        $("#questionFlavor").html(`
          ${divContainer(75)}<img src="images/giphy/final-dead-pinochio.gif" class="gif" alt="pinochio face down in puddle gif"></div>
        `)
      }
      //only update highscore on db if new score is higher than previous highscore
      if (score > highestScore && score !== -1 && stress < 50) {
        const data = {
          currentScore: 20,
          currentStress: 20,
          highScore: score,
          highStress: stress,
          currentQuestionId: 1
        };
        $.ajax({
          method: "PUT",
          url: "/api/high/users/" + user,
          data: data
        }).then(function () {
          updatedScoreboard();
        });
      } else {
        const data = {
          currentScore: 20,
          currentStress: 20,
          highScore: highestScore,
          highStress: highestStress,
          currentQuestionId: 1
        };
        $.ajax({
          method: "PUT",
          url: "/api/high/users/" + user,
          data: data
        }).then(function () {
          updatedScoreboard();
        });
      }
    });
  }
  //display scoreboard by highscore (top 10)
  function updatedScoreboard() {
    $.ajax({
      method: "GET",
      url: "/api/scoreboard"
    }).then(function (result) {
      result.forEach(function (user) {
        ++rank;

        let rankEl = $("<p class='h3 my-4'>" + rank + "</p>");
        let nameEl = $("<p class='h3 my-4'>" + (user.username.charAt(0).toUpperCase() + user.username.slice(1)) + "</p>");
        let scoreEl = $("<p class='h3 my-4'>" + user.highScore + "</p>");

        if (rank === 1) {
          rankEl.addClass("gold");
          nameEl.addClass("gold");
          scoreEl.addClass("gold");
        } else if (rank === 2) {
          rankEl.addClass("silver");
          nameEl.addClass("silver");
          scoreEl.addClass("silver");
        } else if (rank === 3) {
          rankEl.addClass("bronze");
          nameEl.addClass("bronze");
          scoreEl.addClass("bronze");
        }

        $sbRankDiv.append(rankEl);
        $sbNameDiv.append(nameEl);
        $sbScoreDiv.append(scoreEl);
      });
    });
  }

  $('#reset-button').on('click', function () {
    window.location.href = "/classroom";
  });

  $('#changeUser-button').on('click', function () {
    window.location.href = "/";
  });

  saveScoreFinal();
});
